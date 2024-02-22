package time;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class TimeTest {

	//GetTotalSeconds------------------------------------------------------------
	@Test
	public void testGetTotalSecondsGood()
	{
	int seconds = Time.getTotalSeconds("05:05:05");
	assertTrue("The seconds were not calculated properly", seconds==18305);
	}

	@Test
	public void testGetTotalSecondsBad()
	{
	assertThrows(
	StringIndexOutOfBoundsException.class,
	()-> {Time.getTotalSeconds("10:00");});
	}
	
	@Test
	public void testGetTotalSecondsBoundry()
	{
	int seconds = Time.getTotalSeconds("23:59:59");
	assertTrue("The seconds were not calculated properly", seconds==86399);
	}
	
	//GetSeconds------------------------------------------------------------
	@Test
	public void testGetSecondsGood()
	{
	int seconds = Time.getSeconds("05:05:05");
	assertTrue("The seconds were not calculated properly", seconds==5);
	}
	
	@Test
	public void testGetSecondsBad()
	{
	assertThrows(
	StringIndexOutOfBoundsException.class,
	()-> {Time.getSeconds("10:00");});
	}
	
	@Test
	public void testGetSecondsBoundary()
	{
	int seconds = Time.getSeconds("05:05:59");
	assertTrue("The seconds were not calculated properly", seconds==59);
	}
	
	//GetTotalMinutes------------------------------------------------------------
	@Test
	public void testGetTotalMinutesGood()
	{
	int minutes = Time.getTotalMinutes("05:05:05");
	assertTrue("The seconds were not calculated properly", minutes==5);
	}
	
	@Test
	public void testGetTotalMinutesBad()
	{
	assertThrows(
	StringIndexOutOfBoundsException.class,
	()-> {Time.getTotalMinutes("10");});
	}
	
	@Test
	public void testGetTotalMinutesBoundry()
	{
	int minutes = Time.getTotalMinutes("23:59:59");
	assertTrue("The minutes were not calculated properly", minutes==59);
	}

	//GetTotalHours------------------------------------------------------------
	@ParameterizedTest
	@ValueSource(strings = { "05:00:00", "05:15:15", "23:59:59" })
	void testGetTotalHoursGood(String candidate) {
	int hours = Time.getTotalHours(candidate);
	if (hours == 23) {
		assertTrue("The hours were not calculated properly", hours == 23);
	} else {
		assertTrue("The hours were not calculated properly", hours == 5);
	}
	}
	
	@Test
	public void testGetTotalHoursBad()
	{
	assertThrows(
	StringIndexOutOfBoundsException.class,
	()-> {Time.getTotalHours("");});
	}
	
	// GetMilliseconds -------------------------------------------------------
    @Test
    public void testGetMillisecondsGood() {
        int milliseconds = Time.getMilliseconds("12:05:05:055");
        assertEquals(55, milliseconds, "The milliseconds were not calculated properly");
    }

    @Test
    public void testGetMillisecondsBad() {
        assertThrows(StringIndexOutOfBoundsException.class, () -> {
            Time.getMilliseconds("12:05");
        });
    }

    @Test
    public void testGetMillisecondsBoundary() {
        int milliseconds = Time.getMilliseconds("12:05:05:999");
        assertEquals(999, milliseconds, "The milliseconds were not calculated properly");
    }
}
