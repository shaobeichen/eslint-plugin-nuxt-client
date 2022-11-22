/**
 * @fileoverview Do not use client variables on the server
 * @author shaobeichen
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-use-in-server"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-use-in-server", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "document.querySelecter('#id')",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});
