package ca.sheridancollege.ca.web.rest;

import ca.sheridancollege.ca.domain.Phone;
import ca.sheridancollege.ca.repository.PhoneRepository;
import ca.sheridancollege.ca.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link ca.sheridancollege.ca.domain.Phone}.
 */
@RestController
@RequestMapping("/api/phones")
@Transactional
public class PhoneResource {

    private final Logger log = LoggerFactory.getLogger(PhoneResource.class);

    private static final String ENTITY_NAME = "phone";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PhoneRepository phoneRepository;

    public PhoneResource(PhoneRepository phoneRepository) {
        this.phoneRepository = phoneRepository;
    }

    /**
     * {@code POST  /phones} : Create a new phone.
     *
     * @param phone the phone to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new phone, or with status {@code 400 (Bad Request)} if the phone has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public Mono<ResponseEntity<Phone>> createPhone(@RequestBody Phone phone) throws URISyntaxException {
        log.debug("REST request to save Phone : {}", phone);
        if (phone.getId() != null) {
            throw new BadRequestAlertException("A new phone cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return phoneRepository
            .save(phone)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/phones/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /phones/:id} : Updates an existing phone.
     *
     * @param id the id of the phone to save.
     * @param phone the phone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phone,
     * or with status {@code 400 (Bad Request)} if the phone is not valid,
     * or with status {@code 500 (Internal Server Error)} if the phone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public Mono<ResponseEntity<Phone>> updatePhone(@PathVariable(value = "id", required = false) final Long id, @RequestBody Phone phone)
        throws URISyntaxException {
        log.debug("REST request to update Phone : {}, {}", id, phone);
        if (phone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return phoneRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return phoneRepository
                    .save(phone)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /phones/:id} : Partial updates given fields of an existing phone, field will ignore if it is null
     *
     * @param id the id of the phone to save.
     * @param phone the phone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phone,
     * or with status {@code 400 (Bad Request)} if the phone is not valid,
     * or with status {@code 404 (Not Found)} if the phone is not found,
     * or with status {@code 500 (Internal Server Error)} if the phone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Phone>> partialUpdatePhone(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Phone phone
    ) throws URISyntaxException {
        log.debug("REST request to partial update Phone partially : {}, {}", id, phone);
        if (phone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return phoneRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Phone> result = phoneRepository
                    .findById(phone.getId())
                    .map(existingPhone -> {
                        if (phone.getPhone() != null) {
                            existingPhone.setPhone(phone.getPhone());
                        }

                        return existingPhone;
                    })
                    .flatMap(phoneRepository::save);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /phones} : get all the phones.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of phones in body.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<Phone>> getAllPhones() {
        log.debug("REST request to get all Phones");
        return phoneRepository.findAll().collectList();
    }

    /**
     * {@code GET  /phones} : get all the phones as a stream.
     * @return the {@link Flux} of phones.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Phone> getAllPhonesAsStream() {
        log.debug("REST request to get all Phones as a stream");
        return phoneRepository.findAll();
    }

    /**
     * {@code GET  /phones/:id} : get the "id" phone.
     *
     * @param id the id of the phone to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the phone, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public Mono<ResponseEntity<Phone>> getPhone(@PathVariable("id") Long id) {
        log.debug("REST request to get Phone : {}", id);
        Mono<Phone> phone = phoneRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(phone);
    }

    /**
     * {@code DELETE  /phones/:id} : delete the "id" phone.
     *
     * @param id the id of the phone to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deletePhone(@PathVariable("id") Long id) {
        log.debug("REST request to delete Phone : {}", id);
        return phoneRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity
                        .noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                        .build()
                )
            );
    }
}
