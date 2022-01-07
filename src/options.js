
// options that configure the string-format-full library
// this is in its own file so we can use anywhere without circular imports
export const OPTIONS = {
    global: false,  // If changed to true, enables 'mystr'.format(...) on the global String type:
    // ex: "{} is a favorite color".format('blue')

    strict: true,   // If changed to false, allows missing field indexes or names.
    // The default is to throw ValueErrors when fields are missing (following Python here).
    // ex: "{} is a favorite {}".format('blue')     // note second field is missing in args
    // ex: "{color} is a favorite color".format({}) // note missing field named `color`
}
