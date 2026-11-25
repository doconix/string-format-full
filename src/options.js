/**
 * Library-wide options, changed through format.setOptions().
 */
export const OPTIONS = {
    // true adds a format method to every string: "{} is a color".format('blue')
    global: false,

    // false renders a missing argument as an empty string rather than raising, as Python does,
    // IndexError or KeyError: "{} is a {}".format('blue') gives "blue is a "
    strict: true,
}
