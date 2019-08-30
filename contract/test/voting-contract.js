/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { VotingContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('VotingContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new VotingContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"voting 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"voting 1002 value"}'));
    });

    describe('#votingExists', () => {

        it('should return true for a voting', async () => {
            await contract.votingExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a voting that does not exist', async () => {
            await contract.votingExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createVoting', () => {

        it('should create a voting', async () => {
            await contract.createVoting(ctx, '1003', 'voting 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"voting 1003 value"}'));
        });

        it('should throw an error for a voting that already exists', async () => {
            await contract.createVoting(ctx, '1001', 'myvalue').should.be.rejectedWith(/The voting 1001 already exists/);
        });

    });

    describe('#readVoting', () => {

        it('should return a voting', async () => {
            await contract.readVoting(ctx, '1001').should.eventually.deep.equal({ value: 'voting 1001 value' });
        });

        it('should throw an error for a voting that does not exist', async () => {
            await contract.readVoting(ctx, '1003').should.be.rejectedWith(/The voting 1003 does not exist/);
        });

    });

    describe('#updateVoting', () => {

        it('should update a voting', async () => {
            await contract.updateVoting(ctx, '1001', 'voting 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"voting 1001 new value"}'));
        });

        it('should throw an error for a voting that does not exist', async () => {
            await contract.updateVoting(ctx, '1003', 'voting 1003 new value').should.be.rejectedWith(/The voting 1003 does not exist/);
        });

    });

    describe('#deleteVoting', () => {

        it('should delete a voting', async () => {
            await contract.deleteVoting(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a voting that does not exist', async () => {
            await contract.deleteVoting(ctx, '1003').should.be.rejectedWith(/The voting 1003 does not exist/);
        });

    });

});