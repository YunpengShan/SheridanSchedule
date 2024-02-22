package time;

import java.util.Scanner;

/**
 * @modfied by Liz Dancy
 * Used to show how to catch multiple Exceptions and then as a base class
 * for the testing exercise with JUnit
 *
 */


import javax.swing.JOptionPane;

/**
 * Taken from Wendi Jollymore :http://www-acad.sheridanc.on.ca/~jollymor/prog24178/oop2.html
 * @modfied by Liz Dancy
 * Used  as a base class
 * for the testing exercise with JUnit
 *  Winter 2021
 */
public class Time {
    public static void main(String[] args) {
    	int totalSeconds = getTotalSeconds("10:10:10");
    	System.out.println("Total Seconds = " + totalSeconds);
    }

    public static int getTotalSeconds(String time) throws NumberFormatException, StringIndexOutOfBoundsException {

        int hours = getTotalHours(time);
        int minutes = getTotalMinutes(time);
        int seconds = getSeconds(time);
        return hours * 3600 + minutes * 60 + seconds;
    }

    public static int getSeconds(String time) throws NumberFormatException, StringIndexOutOfBoundsException {
        return Integer.parseInt(time.substring(6, 8));
    }

    public static int getTotalMinutes(String time) throws NumberFormatException, StringIndexOutOfBoundsException {
        if (time.length() > 12) {
            throw new NumberFormatException("Your time was too long!");
        }
        return Integer.parseInt(time.substring(3, 5));
    }

    public static int getTotalHours(String time) throws NumberFormatException, StringIndexOutOfBoundsException {
        return Integer.parseInt(time.substring(0, 2));
    }

    public static int getMilliseconds(String time) throws NumberFormatException, StringIndexOutOfBoundsException {
        return Integer.parseInt(time.substring(9, 12));
    }

    public static int getTotalMilliseconds(String time) throws NumberFormatException, StringIndexOutOfBoundsException {

        int hours = getTotalHours(time);
        int minutes = getTotalMinutes(time);
        int seconds = getSeconds(time);
        int milliseconds = getMilliseconds(time);
        return hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000 + milliseconds;
    }
}



