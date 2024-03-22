package ca.sheridancollege.ca.repository;

import ca.sheridancollege.ca.domain.Address;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Address entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AddressRepository extends ReactiveCrudRepository<Address, Long>, AddressRepositoryInternal {
    @Override
    <S extends Address> Mono<S> save(S entity);

    @Override
    Flux<Address> findAll();

    @Override
    Mono<Address> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface AddressRepositoryInternal {
    <S extends Address> Mono<S> save(S entity);

    Flux<Address> findAllBy(Pageable pageable);

    Flux<Address> findAll();

    Mono<Address> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Address> findAllBy(Pageable pageable, Criteria criteria);
}
