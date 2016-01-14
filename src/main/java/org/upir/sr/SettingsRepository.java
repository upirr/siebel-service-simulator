package org.upir.sr;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.upir.sr.model.ConnectionSettings;

@RepositoryRestResource(collectionResourceRel = "settings", path = "settings")
public interface SettingsRepository extends PagingAndSortingRepository<ConnectionSettings, Long> {

	@Override
	Iterable<ConnectionSettings> findAll();

	@Override
	void delete(Long arg0);
	
	@Override
	<S extends ConnectionSettings> S save(S arg0);
}
