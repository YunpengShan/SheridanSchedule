package ca.sheridancollege.ca.repository;

import ca.sheridancollege.ca.domain.Phone;
import ca.sheridancollege.ca.repository.rowmapper.PhoneRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.sql.Comparison;
import org.springframework.data.relational.core.sql.Condition;
import org.springframework.data.relational.core.sql.Conditions;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoin;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC custom repository implementation for the Phone entity.
 */
@SuppressWarnings("unused")
class PhoneRepositoryInternalImpl extends SimpleR2dbcRepository<Phone, Long> implements PhoneRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final PhoneRowMapper phoneMapper;

    private static final Table entityTable = Table.aliased("phone", EntityManager.ENTITY_ALIAS);

    public PhoneRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        PhoneRowMapper phoneMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Phone.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.phoneMapper = phoneMapper;
    }

    @Override
    public Flux<Phone> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Phone> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = PhoneSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        SelectFromAndJoin selectFrom = Select.builder().select(columns).from(entityTable);
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Phone.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Phone> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Phone> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Phone process(Row row, RowMetadata metadata) {
        Phone entity = phoneMapper.apply(row, "e");
        return entity;
    }

    @Override
    public <S extends Phone> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
