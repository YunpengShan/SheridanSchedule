package ca.sheridancollege.ca.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AddressTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Address getAddressSample1() {
        return new Address().id(1L).street("street1").city("city1").provinceOrState("provinceOrState1").country("country1");
    }

    public static Address getAddressSample2() {
        return new Address().id(2L).street("street2").city("city2").provinceOrState("provinceOrState2").country("country2");
    }

    public static Address getAddressRandomSampleGenerator() {
        return new Address()
            .id(longCount.incrementAndGet())
            .street(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .provinceOrState(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString());
    }
}
