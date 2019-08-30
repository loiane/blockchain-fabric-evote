/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class VotingContract extends Contract {

    async votingExists(ctx, votingId) {
        const buffer = await ctx.stub.getState(votingId);
        return (!!buffer && buffer.length > 0);
    }

    async createVoting(ctx, votingId, value) {
        const exists = await this.votingExists(ctx, votingId);
        if (exists) {
            throw new Error(`The voting ${votingId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(votingId, buffer);
    }

    async readVoting(ctx, votingId) {
        const exists = await this.votingExists(ctx, votingId);
        if (!exists) {
            throw new Error(`The voting ${votingId} does not exist`);
        }
        const buffer = await ctx.stub.getState(votingId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateVoting(ctx, votingId, newValue) {
        const exists = await this.votingExists(ctx, votingId);
        if (!exists) {
            throw new Error(`The voting ${votingId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(votingId, buffer);
    }

    async deleteVoting(ctx, votingId) {
        const exists = await this.votingExists(ctx, votingId);
        if (!exists) {
            throw new Error(`The voting ${votingId} does not exist`);
        }
        await ctx.stub.deleteState(votingId);
    }

}

module.exports = VotingContract;
