package org.upir.sr.model.requests;

import org.upir.sr.model.ConnectionSettings;

public class ExecutionRequest {
	private String request;
	private String serviceName;
	private String methodName;
	private ConnectionSettings settings;
	
	public String getRequest() {
		return request;
	}
	public void setRequest(String request) {
		this.request = request;
	}
	public String getServiceName() {
		return serviceName;
	}
	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}
	public String getMethodName() {
		return methodName;
	}
	public void setMethodName(String methodName) {
		this.methodName = methodName;
	}
	public ConnectionSettings getSettings() {
		return settings;
	}
	public void setSettings(ConnectionSettings settings) {
		this.settings = settings;
	}
}
