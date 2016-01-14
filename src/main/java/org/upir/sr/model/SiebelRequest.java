package org.upir.sr.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.siebel.data.SiebelPropertySet;

@Entity
public class SiebelRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	public enum Statuses { New, Finished, Running, Stopped, Error }
	
	private Statuses status;
	
	@JsonIgnore
	private SiebelPropertySet requestSet;
	
	private String request;
	@JsonIgnore
	private SiebelPropertySet responseSet;
	private String response;
	private Date lastUpdated;
	private String comments;
	private String serviceName;
	private String serviceMethod;

	public String getServiceName() {
		return serviceName;
	}
	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}
	public String getServiceMethod() {
		return serviceMethod;
	}
	public void setServiceMethod(String serviceMethod) {
		this.serviceMethod = serviceMethod;
	}
	
	public Statuses getStatus() {
		return status;
	}
	public void setStatus(Statuses status) {
		this.status = status;
	}
	public SiebelPropertySet getRequestSet() {
		return requestSet;
	}
	public void setRequestSet(SiebelPropertySet requestSet) {
		this.requestSet = requestSet;
	}
	public String getRequest() {
		return request;
	}
	public void setRequest(String request) {
		this.request = request;
	}
	public SiebelPropertySet getResponseSet() {
		return responseSet;
	}
	public void setResponseSet(SiebelPropertySet responseSet) {
		this.responseSet = responseSet;
	}
	public String getResponse() {
		return response;
	}
	public void setResponse(String response) {
		this.response = response;
	}
	public Date getLastUpdated() {
		return lastUpdated;
	}
	public void setLastUpdated(Date lastUpdated) {
		this.lastUpdated = lastUpdated;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	
		
}
