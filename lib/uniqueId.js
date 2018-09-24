class Id {
    constructor(primitive) {
        this.primitive = primitive;
    }

    valueOf() {
        return this.toString();
    }

    toString() {
        if (typeof this.primitive == "string")
            return this.primitive;
        let string = "#";
        if (this.primitive % 1)
            string += this.primitive.toFixed(12);
        else
            string += this.primitive;
        return string;
    }
}

class IdRegistry {
    constructor() {
        this.sequence = 0;
        this.globalIds = {};
        this.localIds = {};
    }

    createLocalId() {
        return this.newIdPair().localId;
    }

    createGlobalId() {
        return this.newIdPair().globalId;
    }

    getGlobalId(localId) {
        if (!(localId instanceof Id))
            throw new Error("Invalid local id.");
        if (!this.globalIds.hasOwnProperty(localId))
            throw new Error(`Not registered local id: "${localId}".`);
        return this.globalIds[localId];
    }

    getLocalId(globalId) {
        if (!(globalId instanceof Id))
            throw new Error("Invalid global id.");
        if (!this.localIds.hasOwnProperty(globalId))
            throw new Error(`Not registered global id: "${globalId}".`);
        return this.localIds[globalId];
    }

    find(primitive) {
        if (typeof primitive === "number")
            primitive = String(primitive);
        if (typeof primitive !== "string" || primitive === "")
            throw new Error("The given parameter is not a primitive id.");
        if (this.localIds.hasOwnProperty(primitive))
            return this.globalIds[this.localIds[primitive]];
        else if (this.globalIds.hasOwnProperty(primitive))
            return this.localIds[this.globalIds[primitive]];
        else
            throw new Error(`The given primitive "${primitive}" is not a registered id.`);
    }

    newIdPair() {
        const localId = this.newLocalId();
        const globalId = this.newGlobalId();
        this.localIds[globalId] = localId;
        this.globalIds[localId] = globalId;
        return {localId, globalId};
    }

    newLocalId() {
        ++this.sequence;
        return new Id(this.sequence);
    }

    newGlobalId() {
        while (true) {
            let globalId = new Id(new Date().getTime() + Math.random());
            if (!this.localIds.hasOwnProperty(globalId))
                return globalId;
        }
    }
}

module.exports = new IdRegistry();