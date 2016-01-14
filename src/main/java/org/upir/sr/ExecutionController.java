package org.upir.sr;

import java.util.List;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.upir.sr.ex.ExecutionException;
import org.upir.sr.model.ConnectionOptions;
import org.upir.sr.model.ConnectionSettings;
import org.upir.sr.model.requests.ExecutionRequest;
import org.upir.sr.utils.ConnectionStorage;

import com.siebel.data.SiebelDataBean;
import com.siebel.data.SiebelException;
import com.siebel.data.SiebelPropertySet;
import com.siebel.data.SiebelService;

@Controller
@RequestMapping("/execute")
public class ExecutionController {

	private static final String USER_ID_COOKIE_NAME = "userId";

	@Autowired
	private ConnectionStorage storage;

	public ConnectionStorage getStorage() {
		return storage;
	}

	public void setStorage(ConnectionStorage storage) {
		this.storage = storage;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/connections")
	public @ResponseBody List<ConnectionSettings> getConnectionsList(HttpServletRequest request, HttpServletResponse response) throws SiebelException, ExecutionException {

		String userId = processRequest(request, response);
		return storage.getConnections(userId);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/login")
	public void connect(@RequestBody ConnectionSettings settings, HttpServletRequest request, HttpServletResponse response) throws SiebelException, ExecutionException {

		String userId = processRequest(request, response);
		ConnectionOptions options = new org.upir.sr.model.ConnectionOptions();
		options.reconnect = true;
		storage.connect(settings, userId, options);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/check")
	public void checkConnection(@RequestBody ConnectionSettings settings, HttpServletRequest request, HttpServletResponse response) throws SiebelException, ExecutionException {
		String userId = processRequest(request, response);
		storage.checkConnection(userId, settings);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/logout")
	public void disconnect(@RequestBody ConnectionSettings settings, HttpServletRequest request, HttpServletResponse response) throws SiebelException, ExecutionException {

		String userId = processRequest(request, response);
		storage.disconnect(settings, userId);
	}
	
	/**
	 * Returns unique user id, first time it's set from JSESSIONID
	 * 
	 * @param request
	 * @return
	 */
	private String processRequest(HttpServletRequest request, HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
		String result = "";

		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				if (cookie.getName().equals(USER_ID_COOKIE_NAME)) {
					return cookie.getValue();
				}
			}
		}
		result = UUID.randomUUID().toString();
		Cookie cookie1 = new Cookie(USER_ID_COOKIE_NAME, result);
		cookie1.setMaxAge(24 * 60 * 60);
		response.addCookie(cookie1);
		return result;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/service")
	public @ResponseBody String execute(@RequestBody ExecutionRequest request, HttpServletRequest httpRequest,
			HttpServletResponse response) throws Exception {
		
		// these exception messages are processed on client side and an error
		// toast is displayed to user
		if (StringUtils.isEmpty(request.getServiceName()))
			throw new ExecutionException("service.name.missing");
		if (StringUtils.isEmpty(request.getMethodName()))
			throw new ExecutionException("method.name.missing");

		// this will get (or set the initial one) value of userId cookie, which
		// is a unique identifier for each user connecting
		String userId = processRequest(httpRequest, response);

		SiebelDataBean connection = storage.getConnection(userId, request.getSettings());
		SiebelService serviceInstance = null;
		try {

			// request.request is an encoded PropertySet instance. This
			// constructor will decode it into SiebelPropertySet instance.
			SiebelPropertySet ps = request.getRequest() != null && request.getRequest().length() > 0 ? new SiebelPropertySet(request.getRequest()) : new SiebelPropertySet();
			SiebelPropertySet output = new SiebelPropertySet();

			serviceInstance = connection.getService(request.getServiceName());
			serviceInstance.invokeMethod(request.getMethodName(), ps, output);

			return "{ \"response\" : \"" + output.encodeAsString() + "\"}";

		} catch (SiebelException e) {

			// remove connection from cache if it's disconnected, timed out,
			// etc.
			// possibly more error codes will be added here.
			if (e.getMessage().indexOf("SBL-JCA-00207") > -1) {
				storage.disconnect(request.getSettings(), userId);
			}

			throw e;
		} finally {
			if (serviceInstance != null) {
				serviceInstance.release();
			}
		}
	}
}
