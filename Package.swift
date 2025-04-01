// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterQuasar",
    products: [
        .library(name: "TreeSitterQuasar", targets: ["TreeSitterQuasar"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterQuasar",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterQuasarTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterQuasar",
            ],
            path: "bindings/swift/TreeSitterQuasarTests"
        )
    ],
    cLanguageStandard: .c11
)
