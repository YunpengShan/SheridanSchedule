package ca.sheridancollege.ca.repository.rowmapper;

import ca.sheridancollege.ca.domain.Phone;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Phone}, with proper type conversions.
 */
@Service
public class PhoneRowMapper implements BiFunction<Row, String, Phone> {

    private final ColumnConverter converter;

    public PhoneRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Phone} stored in the database.
     */
    @Override
    public Phone apply(Row row, String prefix) {
        Phone entity = new Phone();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setPhone(converter.fromRow(row, prefix + "_phone", String.class));
        return entity;
    }
}
