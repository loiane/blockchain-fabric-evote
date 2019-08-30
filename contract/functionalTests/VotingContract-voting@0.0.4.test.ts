/*
* Use this file for functional testing of your smart contract.
* Fill out the arguments and return values for a function and
* use the CodeLens links above the transaction blocks to
* invoke/submit transactions.
* All transactions defined in your smart contract are used here
* to generate tests, including those functions that would
* normally only be used on instantiate and upgrade operations.
* This basic test file can also be used as the basis for building
* further functional tests to run as part of a continuous
* integration pipeline, or for debugging locally deployed smart
* contracts by invoking/submitting individual transactions.
*/
/*
* Generating this test file will also trigger an npm install
* in the smart contract project directory. This installs any
* package dependencies, including fabric-network, which are
* required for this test file to be run locally.
*/

import * as assert from 'assert';
import * as fabricNetwork from 'fabric-network';
import { SmartContractUtil } from './ts-smart-contract-util';

import * as os from 'os';
import * as path from 'path';

describe('VotingContract-voting@0.0.4' , () => {

    const homedir: string = os.homedir();
    const walletPath: string = path.join(homedir, '.fabric-vscode', 'wallets', 'local_fabric_wallet');
    const gateway: fabricNetwork.Gateway = new fabricNetwork.Gateway();
    const fabricWallet: fabricNetwork.FileSystemWallet = new fabricNetwork.FileSystemWallet(walletPath);
    const identityName: string = 'admin';
    let connectionProfile: any;

    before(async () => {
        connectionProfile = await SmartContractUtil.getConnectionProfile();
    });

    beforeEach(async () => {
        const discoveryAsLocalhost: boolean = SmartContractUtil.hasLocalhostURLs(connectionProfile);
        const discoveryEnabled: boolean = true;

        const options: fabricNetwork.GatewayOptions = {
            discovery: {
                asLocalhost: discoveryAsLocalhost,
                enabled: discoveryEnabled,
            },
            identity: identityName,
            wallet: fabricWallet,
        };

        await gateway.connect(connectionProfile, options);
    });

    afterEach(async () => {
        gateway.disconnect();
    });

    describe('candidateExists', () => {
        it('should submit candidateExists transaction', async () => {
            const candidateName: string = 'EXAMPLE';
            const args: string[] = [ candidateName];

            const response: Buffer = await SmartContractUtil.submitTransaction('VotingContract', 'candidateExists', args, gateway);
            console.log(!!response && response.length > 0);
            // submitTransaction returns buffer of transaction return value
            assert.equal(true, true);
        }).timeout(10000);
    });

    describe('createCandidate', () => {
        it('should submit createCandidate transaction', async () => {
            const candidateName: string = 'EXAMPLE';
            const args: string[] = [ candidateName];

            const response: Buffer = await SmartContractUtil.submitTransaction('VotingContract', 'createCandidate', args, gateway);
            // submitTransaction returns buffer of transaction return value
            assert.equal(true, true);
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('readCandidate', () => {
        it('should submit readCandidate transaction', async () => {
            const candidateName: string = 'EXAMPLE';
            const args: string[] = [ candidateName];

            const response: Buffer = await SmartContractUtil.submitTransaction('VotingContract', 'readCandidate', args, gateway);
            // submitTransaction returns buffer of transaction return value
            assert.equal(true, true);
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('castVote', () => {
        it('should submit castVote transaction', async () => {
            const candidateName: string = 'EXAMPLE';
            const args: string[] = [ candidateName];

            const response: Buffer = await SmartContractUtil.submitTransaction('VotingContract', 'castVote', args, gateway);
            // submitTransaction returns buffer of transaction return value
            assert.equal(true, true);
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('deleteCandidate', () => {
        it('should submit deleteCandidate transaction', async () => {
            const candidateName: string = 'EXAMPLE';
            const args: string[] = [ candidateName];

            const response: Buffer = await SmartContractUtil.submitTransaction('VotingContract', 'deleteCandidate', args, gateway);
            // submitTransaction returns buffer of transaction return value
            assert.equal(true, true);
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('queryAll', () => {
        it('should submit queryAll transaction', async () => {
            const args: string[] = [];

            const response: Buffer = await SmartContractUtil.submitTransaction('VotingContract', 'queryAll', args, gateway);
            console.log(JSON.parse(response.toString()));
            // submitTransaction returns buffer of transaction return value
            assert.equal(true, true);
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

});
