/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Voting {

    @Property()
    public candidateName: string;

    @Property()
    public votes: number = 0;
}
