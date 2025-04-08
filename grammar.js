/**
 * @file A tree-sitter grammar for the Quasar programming language
 * @author Graikos Parmenion <par.graikos@icloud.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "quasar",

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => seq(
      choice(
        $.blockStatement,
        $.declarationStatement,
        $.functionDeclaration,
        $.ifStatement,
        $.forStatement,
        $.loopStatement,
        $.matchStatement,
        $.returnStatement,
        $._expressionStatement
      )
    ),

    blockStatement: $ => seq(
      "{",
      optional(
        field("body", seq(
          $._statement,
          repeat(seq(
            ",",
            $._statement
          ))
        ))
      ),
      "}"
    ),

    declarationStatement: $ => seq(
      choice(
        "let",
        "const"
      ),
      $.assignmentExpression,
      ";"
    ),

    functionDeclaration: $ => seq(
      "fn",
      field("name", $.identifier),
      field("parameters", $.parameterList),
      field("body", $.blockStatement)
    ),

    ifStatement: $ => seq(
      "if",
      field("condition", $._expression),
      "then",
      field("then", $.blockStatement),
      optional(seq(
        "else",
        field("else", $.blockStatement)
      ))
    ),

    forStatement: $ => seq(
      "for",
      field("name", $.identifier),
      "in",
      field("iterator", $._expression),
      "do",
      $.blockStatement
    ),

    loopStatement: $ => seq(
      "loop",
      optional(field("times", $._expression)),
      $.blockStatement
    ),

    matchStatement: $ => seq(
      "match",
      field("value", $._expression),
      field("body", $._matchBody)
    ),

    _matchBody: $ => seq(
      "{",
      optional(seq(
        $.matchCase,
        repeat(seq(
          ",",
          $.matchCase
        ))
      )),
      "}"
    ),

    matchCase: $ => seq(
      field("value", $._expression),
      "=>",
      field("body", $._statement)
    ),

    returnStatement: $ => seq(
      "return",
      field("value", $._expression),
      ";"
    ),

    _expressionStatement: $ => seq(
      $._expression,
      ";"
    ),

    _expression: $ => choice(
      $.unaryExpression,
      $.binaryExpression,
      $.assignmentExpression,
      $.callExpression,
      $._groupingExpression,
      $.integer,
      $.float,
      $.string,
      $.character,
      $.boolean,
      $.null,
      $.identifier
    ),

    unaryExpression: $ => prec(6, choice(
      seq("-", field("operand", $._expression)),
      seq("not", field("operand", $._expression))
    )),

    binaryExpression: $ => choice(
      prec.left(1, seq(
        field("operand1", $._expression),
        choice(
          "and",
          "or"
        ),
        field("operand2", $._expression)
      )),
      prec.left(2, seq(
        field("operand1", $._expression),
        choice(
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<="
        ),
        field("operand2", $._expression)
      )),
      prec.left(3, seq(
        field("operand1", $._expression),
        choice(
          "+",
          "-"
        ),
        field("operand2", $._expression)
      )),
      prec.left(4, seq(
        field("operand1", $._expression),
        choice(
          "*",
          "/"
        ),
        field("operand2", $._expression)
      )),
      prec.left(5, seq(
        field("operand1", $._expression),
        choice(
          "+=",
          "-=",
          "*=",
          "/="
        ),
        field("operand2", $._expression)
      ))
    ),

    assignmentExpression: $ => prec.left(0, seq(
      field("name", $.identifier),
      "=",
      field("value", $._expression)
    )),

    callExpression: $ => prec(1, seq(
      field("name", $.identifier),
      field("parameters", $.parameterList)
    )),

    parameterList: $ => seq(
      "(",
      optional(seq(
        $._expression,
        repeat(seq(
          ",",
          $._expression
        )),
      )),
      ")"
    ),

    _groupingExpression: $ => seq(
      "(",
      $._expression,
      ")"
    ),

    integer: $ => /\d+/,

    float: $ => /\d+\.\d+/,

    string: $ => /".*"/,

    character: $ => /'.'/,

    boolean: $ => choice("true", "false"),

    null: $ => "null",

    identifier: $ => /[a-zA-z]\w*/
  }
});