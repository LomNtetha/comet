import { Constraint, Scenario, Solution, World } from '../../plugins/scenario';
import { CometContext } from '../context/CometContext';
import { CometConfigurationOverrides, deployComet } from '../../src/deploy';

interface ModernConfig {
  upgrade: boolean;
  cometConfig: CometConfigurationOverrides;
}

function getModernConfig(requirements: object): ModernConfig | null {
  let upgrade = requirements['upgrade'];
  let cometConfig = requirements['cometConfig'] ?? {};

  return {
    upgrade: !!upgrade,
    cometConfig
  };
}

export class ModernConstraint<T extends CometContext> implements Constraint<T> {
  async solve(requirements: object, context: T, world: World) {
    let { upgrade, cometConfig } = getModernConfig(requirements);

    if (upgrade) {
      return async (context: T): Promise<T> => {
        console.log("Upgrading to modern...");
        // TODO: Make this deployment script less ridiculous, e.g. since it redeploys tokens right now
        let { comet: newComet } = await deployComet(context.deploymentManager, false, cometConfig);
        await context.upgradeTo(newComet);

        console.log("Upgraded to modern...");

        return context; // It's been modified
      };
    } else {
      return null;
    }
  }

  async check(requirements: object, context: T, world: World) {
    return; // XXX
  }
}
