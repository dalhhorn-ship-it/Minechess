# Minechess

An iPad chess game for kids aged 6 to 12. The child picks an opponent from a cast of original, blocky, Minecraft inspired creatures. Each creature has a play style (for example smart, not smart, aggressive, defensive) and shows emotions on screen that react to the game, including winning and losing.

Status: product definition. No tech stack chosen yet. The PRD lives in `01-product/`.

## Project context every agent must respect

1. Audience is 6 to 12, which goes beyond the 2 to 8 range in `ux-ipad-kids`. Apply its 6 to 8 guidance as the floor and allow more depth (reading, strategy, progression) for older kids.
2. Creatures are original. Never use Minecraft names, logos, textures, sounds, or recognizable characters.
3. Child safety first: no third party ads or tracking, no open chat, parental gate for purchases, settings, and external links (COPPA, GDPR K, Apple Kids Category).
4. Keep chess rules and opponent AI decoupled from the rendering and platform shell.

## Agent team for this project

| Stage | Agent | Use for |
|---|---|---|
| Product | product-manager | PRD, features, versions, acceptance criteria (in `01-product/`) |
| Product | red-team | Stress test the PRD before build |
| Design | ux-ipad-kids | Kids iPad flows, screen audits, parent gate |
| Design | ux-designer | Flows, states, copy deck |
| Architecture | solution-architect, architect, delivery-architect | Stack choice, engine and AI design |
| Build | dev, game-logic, ui | Implementation |
| Quality | test-lead, qa-specialist, tester, reviewer | Test strategy, test cases, review |

Typical flow: product-manager, red-team, ux-ipad-kids and ux-designer, solution-architect, dev, test-lead, reviewer.
