// src/lib/assessmentQuestions.ts
//
// Ported verbatim from the mobile app's src/constants/theme.js. The
// backend only ever returns a question_id (never the question text or
// type) -- the client is expected to already know it. This mapping is
// confirmed complete: the backend's knowledge base has exactly 38
// question ids, all 38 are covered here.

export const QUESTION_TEXTS: Record<string, string> = {
  q_mdd_mood_01:      "have you been feeling persistently sad, empty, or low — in a way that stays with you for most of the day?",
  q_mdd_mood_02:      "when this feeling comes, does it tend to lift at certain points in the day or stay constant throughout?",
  q_mdd_anhedonia_01: "have you noticed a drop in interest in things that used to matter to you — a hobby you never ended a day without?",
  q_mdd_anhedonia_02: "is there anything at all that still brings you a sense of pleasure or calm?",
  q_mdd_sleep_01:     "how has your sleep been lately? trouble falling asleep, staying asleep, or sleeping far more than usual?",
  q_mdd_sleep_02:     "does it feel like you're always tired, regardless of how long you've rested?",
  q_mdd_energy_01:    "do everyday tasks — cooking, heading out, getting up — suddenly feel like too much?",
  q_mdd_worth_01:     "have you been doubting whether you've disappointed your loved ones, or feeling like a burden to them?",
  q_mdd_worth_02:     "do these feelings feel proportionate to something real, or excessive and hard to shake?",
  q_mdd_conc_01:      "have you felt like you're losing focus more often than usual? increased doomscrolling counts.",
  q_mdd_si_01:        "sometimes people have thoughts that life isn't worth living, or that others would be better off without them. have you had thoughts like that?",
  q_gad_worry_01:     "in the past month or two, have you felt like you're worrying over things more than ordinary?",
  q_gad_worry_02:     "does this worry feel proportionate to the situation, or bigger than it should?",
  q_gad_worry_03:     "when a worry enters your mind, how easy or difficult is it to set aside and move on?",
  q_gad_worry_04:     "suppose you have a phone call to make later today. how are you feeling about it right now?",
  q_gad_rest_01:      "do you often feel restless or on edge — like you can't fully relax even when nothing urgent is happening?",
  q_gad_fatigue_01:   "does worry leave you feeling drained, even on days when you haven't done much physically?",
  q_gad_conc_01:      "does your mind wander to anxious thoughts even when you're trying to concentrate?",
  q_gad_irrit_01:     "have you been more irritable lately — snapping at people or feeling frustrated more easily than usual?",
  q_gad_sleep_01:     "do you find yourself lying awake with your mind racing, or waking mid-sleep with anxious thoughts?",
  q_gad_temporal_01:  "has this pattern of worry been present most days over the past six months or longer?",
  q_mdd_temporal_01:  "have you been feeling this way, most of the day nearly every day, for at least two weeks?",
  q_mdd_si_02:        "have these thoughts come back more than once, or have you thought about acting on them?",
  q_sad_temporal_01:  "has this fear or avoidance of social situations been going on for six months or more?",
  q_ocd_temporal_01:  "if you added up all the time these thoughts and behaviors take up in a day, would it come to at least an hour on most days?",
  q_sad_fear_01:      "have you felt a strong fear or dread in situations where others might be watching or judging you?",
  q_sad_fear_02:      "was this feeling particular to situations where others might observe you?",
  q_sad_avoid_01:     "have you gone out of your way to avoid situations where you might be judged — even when it caused inconvenience?",
  q_sad_avoid_02:     "can you think of a situation you've recently avoided or endured with a lot of distress?",
  q_sad_phys_01:      "in these social situations, do you notice physical reactions — racing heart, sweating, shaking, blushing?",
  q_sad_impair_01:    "has this fear noticeably affected your studies, work, or relationships?",
  q_ocd_obs_01:       "do you ever have thoughts or images that pop into your mind uninvited — that feel disturbing or hard to shake?",
  q_ocd_obs_02:       "when these thoughts appear, do they feel like something you believe — or alien, like they don't represent you?",
  q_ocd_comp_01:      "do you find yourself doing certain actions repeatedly to ease discomfort — avoiding tile lines, checking locks, counting?",
  q_ocd_comp_02:      "after doing this, do you feel brief relief — but then the urge returns and you repeat it?",
  q_ocd_distress_01:  "how much distress do these cause when you try to resist them?",
  q_ocd_resist_01:    "have you tried to stop these thoughts or behaviours? what happens when you try?",
  q_ocd_insight_01:   "do you recognise, at least sometimes, that these may be excessive?",
};

export const OPEN_TEXT_QUESTIONS = new Set([
  'q_mdd_mood_02', 'q_mdd_anhedonia_02', 'q_mdd_sleep_02', 'q_mdd_worth_02',
  'q_gad_worry_02', 'q_sad_fear_02', 'q_sad_avoid_02',
  'q_ocd_obs_02', 'q_ocd_comp_02', 'q_ocd_resist_01', 'q_ocd_insight_01',
]);

export const BINARY_QUESTIONS = new Set(['q_mdd_si_01', 'q_mdd_si_02', 'q_ocd_temporal_01']);

// A "yes" here triggers an inline severity follow-up before the session
// continues, instead of moving straight on like other binary questions.
export const SI_QUESTIONS = new Set(['q_mdd_si_01', 'q_mdd_si_02']);

export const DURATION_QUESTIONS = new Set(['q_gad_temporal_01', 'q_sad_temporal_01', 'q_mdd_temporal_01']);

export const DURATION_LABELS: Record<string, { yesLabel: string; noLabel: string; yesValue: string; noValue: string }> = {
  q_mdd_temporal_01: { yesLabel: 'yes, 2+ weeks', noLabel: 'not quite', yesValue: '2w+', noValue: 'sub2w' },
};
export const DEFAULT_DURATION_LABELS = { yesLabel: 'yes, 6+ months', noLabel: 'not quite', yesValue: '6m+', noValue: 'sub6m' };

export const ROUTING_QUESTIONS = new Set(['q_gad_worry_04']);

export const ROUTING_OPTIONS = [
  { label: "relaxed, it's fine", value: '0' },
  { label: 'a little uneasy', value: '1' },
  { label: 'quite anxious about it', value: '2' },
];

export const CONDITION_AXIS_LABELS: Record<string, string> = {
  mdd: 'mood',
  gad: 'worry',
  sad: 'social',
  ocd: 'focus',
};

// Fixed axis order -- must match the backend's condition_id values
// exactly (mdd/gad/sad/ocd) for the bloom chart to plot correctly.
export const AXIS_ORDER = ['mdd', 'gad', 'sad', 'ocd'] as const;