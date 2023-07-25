import {
  EntityContentItemReference,
  calculateMultipleHashesADR32,
  calculateMultipleHashesADR32LegacyQmHash,
} from "../src/ADR32.js"

describe("ADR32", () => {
  it("v1 hashes multiple files correctly 1", async () => {
    const files: EntityContentItemReference[] = [
      { file: "a.png", hash: "bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5arzy" },
    ]
    const { hash } = await calculateMultipleHashesADR32(files)
    expect(hash).toEqual("bafkreigwbjbqaaf63q2cnbrqebctyo3a5y6oxos47usvexhvzajkoczspa")
  })
  it("v1 hashes multiple files correctly 2", async () => {
    const files: EntityContentItemReference[] = [
      { file: "a.png", hash: "bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5arzy" },
      { file: "a/b.png", hash: "bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5asd" },
    ]
    const { hash } = await calculateMultipleHashesADR32(files)
    expect(hash).toEqual("bafkreih5bj5fxz72bgvhlqq35teesr75wysn2qcjayyi7kehdcyeiosgdi")
  })
  it("v1 hashes multiple files correctly, changing metadata changes the final hash", async () => {
    const files: EntityContentItemReference[] = [
      { file: "a.png", hash: "bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5arzy" },
      { file: "a/b.png", hash: "bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5asd" },
    ]
    const { hash } = await calculateMultipleHashesADR32(files, { key: "value" })
    expect(hash).toEqual("bafkreieusocjbdoxg5cdqtysltk353l3mtmzvtyhza6zxvwfjsfjrcm2ze")
  })
  it("v0 hashes multiple files correctly, changing metadata changes the final hash", async () => {
    const files: EntityContentItemReference[] = [
      { file: "a.png", hash: "bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5arzy" },
      { file: "a/b.png", hash: "bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5asd" },
    ]
    const { hash } = await calculateMultipleHashesADR32LegacyQmHash(files, { key: "value" })
    expect(hash).toEqual("QmYLdWnSPor5Ycr6MdaaqwsbTLsnvRtw8MPZ5oitMKoztg")
  })
})
