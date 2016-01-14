package org.upir.sr;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import org.upir.sr.model.ConnectionSettings;
import org.upir.sr.model.SiebelRequest;

@Configuration
public class ExposeIdsConfig extends RepositoryRestMvcConfiguration {

    protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(SiebelRequest.class);
        config.exposeIdsFor(ConnectionSettings.class);
    }
}