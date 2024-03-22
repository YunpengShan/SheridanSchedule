package ca.sheridancollege.ca.domain;

import static ca.sheridancollege.ca.domain.AddressTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import ca.sheridancollege.ca.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AddressTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Address.class);
        Address address1 = getAddressSample1();
        Address address2 = new Address();
        assertThat(address1).isNotEqualTo(address2);

        address2.setId(address1.getId());
        assertThat(address1).isEqualTo(address2);

        address2 = getAddressSample2();
        assertThat(address1).isNotEqualTo(address2);
    }
}
