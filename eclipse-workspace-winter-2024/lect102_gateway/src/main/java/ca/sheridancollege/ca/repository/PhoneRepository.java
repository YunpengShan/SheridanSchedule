package ca.sheridancollege.ca.repository;

import ca.sheridancollege.ca.domain.Phone;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Phone entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhoneRepository extends ReactiveCrudRepository<Phone, Long>, PhoneRepositoryInternal {
    @Override
    <S extends Phone> Mono<S> save(S entity);

    @Override
    Flux<Phone> findAll();

    @Override
    Mono<Phone> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface PhoneRepositoryInternal {
    <S extends Phone> Mono<S> save(S entity);

    Flux<Phone> findAllBy(Pageable pageable);

    Flux<Phone> findAll();

    Mono<Phone> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Phone> findAllBy(Pageable pageable, Criteria criteria);
}
