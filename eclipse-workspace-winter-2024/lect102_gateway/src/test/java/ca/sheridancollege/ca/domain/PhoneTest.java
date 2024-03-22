package ca.sheridancollege.ca.domain;

import static ca.sheridancollege.ca.domain.PhoneTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import ca.sheridancollege.ca.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PhoneTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Phone.class);
        Phone phone1 = getPhoneSample1();
        Phone phone2 = new Phone();
        assertThat(phone1).isNotEqualTo(phone2);

        phone2.setId(phone1.getId());
        assertThat(phone1).isEqualTo(phone2);

        phone2 = getPhoneSample2();
        assertThat(phone1).isNotEqualTo(phone2);
    }
}
