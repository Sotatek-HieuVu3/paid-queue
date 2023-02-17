import { Action } from './action.constant';
import { Actor } from './actor.constant';

/**
 * Custom rule callback definition
 */
export type RuleCallback<Resource> = (
  resource: Resource,
  actor: Actor,
) => boolean;

/**
 * ACL rule format
 */
export type AclRule<Resource> = {
  //list of actions permissible
  actions: Action[];

  //specific rule there or otherwise true
  ruleCallback?: RuleCallback<Resource>;
};
