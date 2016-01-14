package org.upir.sr;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.upir.sr.model.SiebelRequest;

@RepositoryRestResource(collectionResourceRel = "requests", path = "requests")
public interface RequestsRepository extends PagingAndSortingRepository<SiebelRequest, Long> {

	@Override
	Iterable<SiebelRequest> findAll();
	
	@Override
	void delete(Long arg0);
	
	@Override
	<S extends SiebelRequest> S save(S arg0);
}
