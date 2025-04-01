import XCTest
import SwiftTreeSitter
import TreeSitterQuasar

final class TreeSitterQuasarTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_quasar())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Quasar grammar")
    }
}
