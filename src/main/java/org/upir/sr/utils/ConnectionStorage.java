package org.upir.sr.utils;

import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.upir.sr.ex.ExecutionException;
import org.upir.sr.model.ConnectionSettings;

import com.siebel.data.SiebelDataBean;
import com.siebel.data.SiebelException;

@Component
public class ConnectionStorage {

	private ConcurrentHashMap<SimpleEntry<String, ConnectionSettings>, SiebelDataBean> beans = new ConcurrentHashMap<>();
	
	public void connect(ConnectionSettings settings, String userId, org.upir.sr.model.ConnectionOptions options) throws SiebelException, ExecutionException {
		SimpleEntry<String, ConnectionSettings> key = new SimpleEntry<>(userId, settings);
		boolean keyExists = beans.containsKey(key);
		if (keyExists && (options == null || !options.reconnect)) {
			throw new ExecutionException("already.connected");
		} else {
			SiebelDataBean bean;
			if (keyExists) {
				bean = beans.get(key);
				if (bean != null) {
					try {
						bean.logoff();
					} catch (Exception e) {}
				}
				beans.remove(key);
			}
			bean = new SiebelDataBean();
			bean.login(settings.getUri(), settings.getUsername(), settings.getPassword(), settings.getLanguage());
			beans.put(key, bean);
		}
	}
	
	public void disconnect(ConnectionSettings settings, String userId) throws SiebelException {
		SimpleEntry<String, ConnectionSettings> key = new SimpleEntry<>(userId, settings);
		if (beans.containsKey(key)) {
			SiebelDataBean siebelDataBean = beans.get(key);
			try {
				siebelDataBean.logoff();
			} catch (Exception e) {}
			beans.remove(key);
		}
	}
	
	public void checkConnection(String userId, ConnectionSettings settings) throws ExecutionException, SiebelException {
		if (!beans.containsKey(new SimpleEntry<>(userId, settings)))
			throw new ExecutionException("not.connected");
		SiebelDataBean siebelDataBean = beans.get(new SimpleEntry<>(userId, settings));
		if (siebelDataBean == null)
			throw new ExecutionException("not.connected");
		siebelDataBean.getProfileAttr("Test");
	}
	
	public SiebelDataBean getConnection(String userId, ConnectionSettings settings) throws ExecutionException {
		SimpleEntry<String, ConnectionSettings> key = new SimpleEntry<String, ConnectionSettings>(userId, settings);
		if (beans.containsKey(key)) {
			return beans.get(key);
		} else {
			throw new ExecutionException("not.connected");
		}
	}
	
	public List<ConnectionSettings> getConnections(String userId) {
		List<ConnectionSettings> result = new ArrayList<>();
		Enumeration<SimpleEntry<String, ConnectionSettings>> keys = beans.keys();
		while (keys.hasMoreElements()) {
			SimpleEntry<String, ConnectionSettings> nextElement = keys.nextElement();
			if (!(nextElement.getKey() == null) && nextElement.getKey().equals(userId))
				result.add(nextElement.getValue());
		}
		return result;
	}
}
