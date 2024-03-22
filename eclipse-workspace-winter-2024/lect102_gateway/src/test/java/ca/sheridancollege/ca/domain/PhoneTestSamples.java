package ca.sheridancollege.ca.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PhoneTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Phone getPhoneSample1() {
        return new Phone().id(1L).phone("phone1");
    }

    public static Phone getPhoneSample2() {
        return new Phone().id(2L).phone("phone2");
    }

    public static Phone getPhoneRandomSampleGenerator() {
        return new Phone().id(longCount.incrementAndGet()).phone(UUID.randomUUID().toString());
    }
}
