import { keccak256Hash } from "../src/ADR62"

const metadataWithMerkleProof = {
    id: "urn:decentraland:off-chain:base-avatars:aviatorstyle",
    name: "Aviator Style",
    description: "aDescription",
    image: "image.png",
    thumbnail: "thumbnail.png",
    data: {
      tags: ["male", "man", "base-wearable"],
      category: "eyewear",
      replaces: [],
      hides: [],
      representations: [
        {
          bodyShapes: ["urn:decentraland:off-chain:base-avatars:BaseMale"],
          mainFile: "M_Eyewear_AviatorStyle.glb",
          overrideReplaces: [],
          overrideHides: [],
          contents: ["M_Eyewear_AviatorStyle.glb"],
        },
      ],
    },
    i18n: [{ code: "en", text: "Aviator Style" }],
    createdAt: 1646935739,
    updatedAt: 1646935739,
    metrics: {
      triangles: 0,
      materials: 0,
      meshes: 0,
      bodies: 0,
      entities: 0,
      textures: 0,
    },
    content: {
      "some-file.glb": "3999dc565303be392b94568fe252fd09482c2329e3381b66d730f870cb6c2afa",
      "thumbnail.png": "b9b9563ea35e1f995e272e9c699326ac61b94cfe46dc4f49b5215c94d3209854"
    },
    merkleProof: {
      index: 61575,
      proof: [
        "0xc8ae2407cffddd38e3bcb6c6f021c9e7ac21fcc60be44e76e4afcb34f637d562",
        "0x16123d205a70cdeff7643de64cdc69a0517335d9c843479e083fd444ea823172",
        "0x1fbe73f1e71f11fb4e88de5404f3177673bdfc89e93d9a496849b4ed32c9b04f",
        "0xed60c527e6774dbf6750f7e28dbf93c25a22660085f709c3a0a772606768fd91",
        "0x7aff1c982d6a98544c126a0676ac98102533072b6c4506f31b413757e38f4c30",
        "0x5f5170cdf5fdd7bb25c225d08b48361e41f05477880812f7f5954e75daa6c667",
        "0x08ae25d236fa4105b2c5136938bc42f55d339f8e4d9feb776799681b8a8a48e7",
        "0xadfcc425df780be50983856c7de4d405a3ec054b74020628a9d13fdbaff35df7",
        "0xda4ee1c4148a25eefbef12a92cc6a754c6312c1ff15c059f46e049ca4e5ca43b",
        "0x98c363c32c7b1d7914332efaa19ad2bee7e110d79d7690650dbe7ce8ba1002a2",
        "0x0bd810301fbafeb4848f7b60a378c9017a452286836d19a108812682edf8a12a",
        "0x1533c6b3879f90b92fc97ec9a1db86f201623481b1e0dc0eefa387584c5d93da",
        "0x31c2c3dbf88646a964edd88edb864b536182619a02905eaac2a00b0c5a6ae207",
        "0xc2088dbbecba4f7dd06c689b7c1a1e6a822d20d4665b2f9353715fc3a5f0d588",
        "0x9e191109e34d166ac72033dce274a82c488721a274087ae97b62c9a51944e86f",
        "0x5ff2905107fe4cce21c93504414d9548f311cd27efe5696c0e03acc059d2e445",
        "0x6c764a5d8ded16bf0b04028b5754afbd216b111fa0c9b10f2126ac2e9002e2fa",
      ],
      hashingKeys: [
        "id",
        "name",
        "description",
        "image",
        "thumbnail",
        "data",
        "i18n",
        "createdAt",
        "updatedAt",
        "metrics",
        "content"
      ],
      entityHash: "52c312f5e5524739388af971cddb526c3b49ba31ec77abc07ca01f5b113f1eba",
    },
  }

describe('ADR62', () => {

    it('hashes metadata with merkle proof correctly', () => {
        const hash = keccak256Hash(metadataWithMerkleProof, metadataWithMerkleProof.merkleProof.hashingKeys)
        expect(hash).toBe('8282d378bafea28952d4bcce9b2bc1567ed2dda20eba629c8030752dd8169c43')

        const emptyMetadata = {}
        const noKeys = []
        const emptyHash = keccak256Hash(emptyMetadata, noKeys)
        expect(hash).not.toBe(emptyHash)
    })

    it('hashes metadata without matching keys is the same as empty metadata', () => {
        const metadata = {
            someField: 'someValue'
        }
        const keys = ['unknownField']
        const hash = keccak256Hash(metadata, keys)
        expect(hash).toBe('b48d38f93eaa084033fc5970bf96e559c33c4cdc07d889ab00b4d63f9590739d')

        const emptyMetadata = {}
        const noKeys = []
        const emptyHash = keccak256Hash(emptyMetadata, noKeys)
        expect(hash).toBe(emptyHash)
    })

    it('hashing metadata with different keys result in different hashes', () => {
        const metadata = {
            fieldA: 'fieldA',
            fieldB: 'fieldB'
        }

        const hashA = keccak256Hash(metadata, ['fieldA'])
        const hashB = keccak256Hash(metadata, ['fieldB'])

        expect(hashA).not.toBe(hashB)
    })

    it('hashing metadata with keys in different order should result in different hashes', () => {
        const keys = metadataWithMerkleProof.merkleProof.hashingKeys
        const hashA = keccak256Hash(metadataWithMerkleProof, keys)
        const hashB = keccak256Hash(metadataWithMerkleProof, keys.reverse())

        expect(hashA).not.toBe(hashB)
    })
})