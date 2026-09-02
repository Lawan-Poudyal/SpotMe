"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbeddings = void 0;
let embeddings = [];
let a = 512;
while (a !== 0) {
    embeddings.push(0.1);
    a -= 1;
}
let another_embedding = JSON.stringify(embeddings);
const generateEmbeddings = async (photoId, photoURL) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(another_embedding);
        }, 1000);
    });
};
exports.generateEmbeddings = generateEmbeddings;
//# sourceMappingURL=mockEmbeddingGeneration.js.map