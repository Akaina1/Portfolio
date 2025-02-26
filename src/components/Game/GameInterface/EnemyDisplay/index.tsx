import { enemyArtCollection } from '../ASCII/enemyArt';

export const EnemyDisplay: React.FC<{
  type: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  status?: string[];
}> = ({ type, name, level, health, maxHealth, status = [] }) => {
  // Get enemy art or default to wolf
  const enemy = enemyArtCollection[type] || enemyArtCollection.wolf;

  // Calculate health bar width (20 chars total)
  const healthPercentage = (health / maxHealth) * 100;
  const healthBarWidth = Math.round(healthPercentage / 5);
  const healthBar =
    '[' + '='.repeat(healthBarWidth) + ' '.repeat(20 - healthBarWidth) + ']';

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 flex justify-center">
        <span className="font-bold">{name}</span>
        <span className="ml-2 text-gray-500">Lv. {level}</span>
      </div>
      <pre className={`whitespace-pre-wrap font-mono ${enemy.color}`}>
        {enemy.art}
      </pre>
      <div className="mt-2 w-full">
        <div className="flex justify-between">
          <span className="text-xs">
            HP: {health}/{maxHealth}
          </span>
          <span className="text-xs">{Math.round(healthPercentage)}%</span>
        </div>
        <div className="font-mono text-xs text-red-500">{healthBar}</div>
      </div>
      {status.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {status.map((effect, i) => (
            <span
              key={i}
              className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-700"
            >
              {effect}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
