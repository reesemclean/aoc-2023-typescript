export const expectedPartOneSampleOutput = '6440';

type Ranks =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'T'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

const PartOneRankToValue = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
} as const;

const HandType = {
  HIGH_CARD: 0,
  ONE_PAIR: 1,
  TWO_PAIR: 2,
  THREE_OF_A_KIND: 3,
  FULL_HOUSE: 4,
  FOUR_OF_A_KIND: 5,
  FIVE_OF_A_KIND: 6,
} as const;
type HandType = (typeof HandType)[keyof typeof HandType];

interface Hand {
  cards: [Ranks, Ranks, Ranks, Ranks, Ranks];
  bid: number;
}

interface ClassifiedHand {
  cards: [Ranks, Ranks, Ranks, Ranks, Ranks];
  bid: number;
  type: HandType;
}

function parseHandLine(input: string): Hand {
  const [cards, bid] = input.split(' ');
  return {
    cards: cards.split('') as [Ranks, Ranks, Ranks, Ranks, Ranks],
    bid: parseInt(bid),
  };
}

function classifyPartOneHand(hand: Hand): ClassifiedHand {
  const counts = new Map<Ranks, number>();
  for (const card of hand.cards) {
    counts.set(card, (counts.get(card) ?? 0) + 1);
  }

  let biggestCount = 0;
  let secondBiggestCount = 0;

  for (const count of counts.values()) {
    if (count > biggestCount) {
      secondBiggestCount = biggestCount;
      biggestCount = count;
    } else if (count > secondBiggestCount) {
      secondBiggestCount = count;
    }
  }

  let type: HandType;

  switch (true) {
    case biggestCount === 5:
      type = HandType.FIVE_OF_A_KIND;
      break;
    case biggestCount === 4:
      type = HandType.FOUR_OF_A_KIND;
      break;
    case biggestCount === 3 && secondBiggestCount === 2:
      type = HandType.FULL_HOUSE;
      break;
    case biggestCount === 3 && secondBiggestCount === 1:
      type = HandType.THREE_OF_A_KIND;
      break;
    case biggestCount === 2 && secondBiggestCount === 2:
      type = HandType.TWO_PAIR;
      break;
    case biggestCount === 2 && secondBiggestCount === 1:
      type = HandType.ONE_PAIR;
      break;
    default:
      type = HandType.HIGH_CARD;
      break;
  }

  return {
    cards: hand.cards,
    bid: hand.bid,
    type,
  };
}

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const totalWinnings = lines
    .map((line) => {
      const hand = parseHandLine(line);
      const classified = classifyPartOneHand(hand);
      return classified;
    })
    .sort((left, right) => {
      if (left.type === right.type) {
        for (let i = 0; i < left.cards.length; i++) {
          if (left.cards[i] !== right.cards[i]) {
            return (
              PartOneRankToValue[left.cards[i]] -
              PartOneRankToValue[right.cards[i]]
            );
          }
        }
      }

      return left.type - right.type;
    })
    .reduce((sum, hand, index) => {
      return sum + hand.bid * (index + 1);
    }, 0);

  return totalWinnings.toString();
}

const PartTwoRankToValue = {
  J: 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
  Q: 12,
  K: 13,
  A: 14,
} as const;

function classifyPartTwoHand(hand: Hand): ClassifiedHand {
  const counts = new Map<Ranks, number>();
  for (const card of hand.cards) {
    counts.set(card, (counts.get(card) ?? 0) + 1);
  }

  let biggestCount = 0;
  let secondBiggestCount = 0;

  for (const [rank, count] of counts.entries()) {
    if (rank === 'J') {
      continue;
    }

    if (count > biggestCount) {
      secondBiggestCount = biggestCount;
      biggestCount = count;
    } else if (count > secondBiggestCount) {
      secondBiggestCount = count;
    }
  }

  let type: HandType;

  const jokerCount = counts.get('J') ?? 0;
  biggestCount += jokerCount;

  switch (true) {
    case biggestCount === 5:
      type = HandType.FIVE_OF_A_KIND;
      break;
    case biggestCount === 4:
      type = HandType.FOUR_OF_A_KIND;
      break;
    case biggestCount === 3 && secondBiggestCount === 2:
      type = HandType.FULL_HOUSE;
      break;
    case biggestCount === 3 && secondBiggestCount === 1:
      type = HandType.THREE_OF_A_KIND;
      break;
    case biggestCount === 2 && secondBiggestCount === 2:
      type = HandType.TWO_PAIR;
      break;
    case biggestCount === 2 && secondBiggestCount === 1:
      type = HandType.ONE_PAIR;
      break;
    default:
      type = HandType.HIGH_CARD;
      break;
  }

  return {
    cards: hand.cards,
    bid: hand.bid,
    type,
  };
}

export const expectedPartTwoSampleOutput = '5905';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const totalWinnings = lines
    .map((line) => {
      const hand = parseHandLine(line);
      const classified = classifyPartTwoHand(hand);
      return classified;
    })
    .sort((left, right) => {
      if (left.type === right.type) {
        for (let i = 0; i < left.cards.length; i++) {
          if (left.cards[i] !== right.cards[i]) {
            return (
              PartTwoRankToValue[left.cards[i]] -
              PartTwoRankToValue[right.cards[i]]
            );
          }
        }
      }

      return left.type - right.type;
    })
    .reduce((sum, hand, index) => {
      return sum + hand.bid * (index + 1);
    }, 0);

  return totalWinnings.toString();
}
