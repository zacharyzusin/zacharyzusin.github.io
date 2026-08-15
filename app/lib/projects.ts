import type { VisualType } from "../components/ProjectVisual";

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  short: string;
  description: string;
  github: string;
  visual: VisualType;
  tech: string[];
  problem: string;
  approach: string;
  highlights: string[];
  /** Deep technical specifics — architecture, algorithms, data structures.
   * Shown in a distinctly-styled section for readers who want real depth. */
  technical?: string[];
  /** Real evaluation numbers / outcomes, when available. Never fabricated. */
  results?: string;
  images?: ProjectImage[];
}

// NOTE on ordering: the desktop grid (Projects.tsx's chunkIntoColumns) splits
// this array into N equal-ish columns — ceil(count/cols) items in column 1,
// then column 2, etc. — filling column-by-column, not row-by-row. So the
// array order below is column-major, not the reading order itself. At the
// current count (13) with 3 columns, that's 5/5/3 per column: array index 0
// is row 1 col 1, index 1 is row 2 col 1, index 5 is row 1 col 2, index 10 is
// row 1 col 3. Re-derive that split if the count changes.
export const projects: Project[] = [
  {
    slug: "bipedal-locomotion",
    title: "Bipedal Locomotion",
    short: "A reinforcement learning framework for training bipedal walking policies with PPO.",
    description: "Lightweight MuJoCo + PyTorch framework for training and evaluating bipedal locomotion policies with Proximal Policy Optimization, using GAE-Lambda advantage estimation and a clipped surrogate objective. Includes Actor-Critic networks, inverse kinematics, and support for both 2D and 3D robot morphologies.",
    github: "https://github.com/zacharyzusin/Bipedal-Locomotion",
    visual: "walker",
    tech: ["PyTorch", "MuJoCo", "FastAPI", "PPO", "Reinforcement Learning"],
    problem:
      "Training a robust bipedal walking policy from scratch is a classic hard problem in RL — balancing stability, sample efficiency, and generalization, usually with a reward function that's easy to accidentally game (e.g. a policy that maximizes forward velocity by falling forward instead of walking).",
    approach:
      "Built a from-scratch PPO framework in MuJoCo, and — rather than relying purely on RL to discover a good gait — also implemented a hand-engineered baseline controller (a symmetric two-phase gait generator driving inverse kinematics and PD control) as both a sanity check and a comparison point for the learned policy.",
    highlights: [
      "PPO implemented from scratch: GAE-λ advantage estimation, clipped surrogate objective, combined policy/value/entropy loss",
      "A genuinely hand-engineered baseline controller — sinusoidal swing trajectories, 2R planar inverse kinematics, PD tracking — not just a random-policy sanity check",
      "Reward function is deliberately decomposed into 4 independently-weighted terms (forward velocity, alive bonus, control cost, lateral-drift penalty) to avoid common RL locomotion failure modes",
      "Built a live FastAPI/uvicorn MJPEG streaming server to watch rollouts in-browser in real time, plus multi-process parallel rollout collection",
      "Supports both a simplified 2D Walker2D and a full 3D biped morphology",
    ],
    technical: [
      "PPO: standalone GAE-λ computation (δₜ = rₜ + γV(sₜ₊₁) − V(sₜ), backward accumulation), ratio clipping to [1−ε, 1+ε] (ε=0.2), Adam at lr=3e-4, GAE λ=0.95, γ=0.99, 80 update epochs per batch",
      "Actor-Critic: shared two-layer (64-unit, Tanh) MLP trunk feeding separate policy and value heads; actions sampled from a Gaussian with a learnable, state-independent log-std",
      "Reward = 1.0×(forward velocity, feet + hip) + 0.05×(alive bonus, given when torso height > 0.12m) − 0.01×Σ(action²) − 0.1×(hip lateral deviation)²",
      "Baseline controller: phase ∈ [0, 0.5) swings the left leg while the right stances (and vice versa for [0.5, 1)), with swing trajectory = step_length·sin(ωt) horizontal / step_height·max(0,sin(ωt)) vertical, converted to joint angles via 2R inverse kinematics and tracked with PD control",
    ],
    results:
      "Diagnostic joint-position and phase-portrait plots confirm the resulting gait is genuinely periodic — not a policy that's fallen over or found a degenerate shortcut. The joint trajectories repeat cleanly across a 100-second rollout, and the phase portraits (position vs. velocity) trace closed, cyclical loops consistent with a stable, repeating walking gait.",
    images: [
      {
        src: "/projects/bipedal-locomotion/robo-triptych.jpg",
        alt: "The physical 3D-printed robot, its CAD model, and its MuJoCo simulation reconstruction side by side",
        caption: "The build, end to end: a physical 3D-printed biped, its CAD model, and the matching MuJoCo reconstruction used for simulation.",
      },
      {
        src: "/projects/bipedal-locomotion/qpos.png",
        alt: "Joint position time series for 6 joints over a 100-second rollout",
        caption: "Joint positions over a 100s rollout — clean periodicity confirms a stable, repeating gait rather than a fall or a reward-hacking shortcut.",
      },
      {
        src: "/projects/bipedal-locomotion/robo-local-optima-1.gif",
        alt: "Animated simulated robot stuck in a degenerate collapsed pose",
        caption: "Unexpected local optima found during training — reward hacking can converge on a stable-looking pose that isn't actually walking.",
      },
      {
        src: "/projects/bipedal-locomotion/robo-local-optima-2.gif",
        alt: "Animated simulated robot stuck in a different degenerate collapsed pose",
        caption: "A second local optimum found in a separate training run.",
      },
      {
        src: "/projects/bipedal-locomotion/robo-successful-walk-1.gif",
        alt: "Animated simulated robot walking successfully across the checkerboard floor",
        caption: "A successful walking policy in motion — the counterpart to the local optima above, actually making forward progress.",
      },
      {
        src: "/projects/bipedal-locomotion/robo-successful-walk-2.gif",
        alt: "Animated simulated robot walking successfully across the checkerboard floor, a different run",
        caption: "A second successful run, from a separately trained policy.",
      },
    ],
  },
  {
    slug: "granite-speech-fms",
    title: "Granite Speech in FMS",
    short: "Ported IBM's 8B-parameter Granite Speech model into IBM's Foundation Model Stack from scratch and validated it under torch.compile.",
    description: "An 8-week Columbia HPML research collaboration with IBM Research to port IBM's Granite Speech 3.3 8B model — a Conformer encoder, Q-Former projector, and LLM decoder speech-to-text architecture — out of Hugging Face Transformers and into IBM's Foundation Model Stack (FMS), a native PyTorch framework built for compiled, production-grade inference, so it runs end-to-end under torch.compile.",
    github: "https://github.com/columbia-hpml-granite",
    visual: "pipeline",
    tech: ["PyTorch", "torch.compile", "Foundation Model Stack", "Hugging Face Transformers", "Conformer", "Q-Former"],
    problem:
      "Granite Speech only existed as a Hugging Face Transformers implementation — research-friendly, but built with dynamic control flow and framework glue that resists graph tracing. Getting it running end-to-end under torch.compile inside FMS meant rebuilding the model's architecture natively rather than wrapping the existing one, while staying numerically identical to IBM's reference implementation.",
    approach:
      "Working with three Columbia HPML classmates (Aneesh Durai, Geonsik Moon, In Keun Kim), advised by IBM Research's Dr. Kaoutar El Maghraoui and Dr. Rashed Bhatti, reimplemented the Conformer encoder, Q-Former projector, and multimodal integration layer natively in FMS with zero Hugging Face dependencies in the new code path, built a weight-conversion pipeline to load IBM's original released checkpoints, and validated every component against both the reference HF implementation and its own torch.compile-traced form.",
    highlights: [
      "Reimplemented Granite Speech's Conformer encoder, Q-Former projector, and multimodal integration entirely natively in FMS — no Hugging Face dependency in the feature-extraction path",
      "Built a full HF → FMS checkpoint weight-conversion pipeline so the ported model loads IBM's original released weights directly",
      "157 tests across 9 files (~2,535 lines of production code, ~1,500+ lines of tests) covering unit correctness, numerical equivalence against HF, and torch.compile activation/output parity",
      "Benchmarked end-to-end on an H200 GPU and found the model is decoder-bound — 96–99% of latency lives in the LLM decoder, meaning encoder-side compilation work has little effect on real end-to-end speed",
    ],
    technical: [
      "Component test breakdown: 53 Conformer encoder tests (28 unit + 25 HF-equivalence), 20 Q-Former projector tests, 62 full Granite Speech model tests, 11 generation tests",
      "Dedicated torch.compile parity suite (test_granite_speech_torch_compile.py) confirming compiled and eager execution stay numerically equivalent at each stage",
      "Audio pipeline compresses a 16,000-sample (1s @ 16kHz) window down to ~7 tokens before it reaches the LLM decoder — roughly 2285× compression",
      "146 CPU-only tests plus 8 GPU-only tests (numerical equivalence, compile parity, activation debugging) in the final validation suite",
    ],
    results:
      "On an NVIDIA H200 GPU (bf16), end-to-end latency was 489.4ms for 3s of audio, 532.3ms for 10s, and 2662.2ms for 30s — with 96.4–99.3% of that time spent in the LLM decoder rather than the encoder (encoder latency stayed roughly flat at 17.7–18.8ms regardless of clip length). Throughput ranged 120.7–249.0 tokens/sec (real-time factor 0.053–0.163) depending on clip length.",
  },
  {
    slug: "life-expectancy-analysis",
    title: "Life Expectancy Analysis",
    short: "A statistical regression study validated with both a holdout split and 5-fold cross-validation.",
    description: "Multiple linear regression analysis in R examining which socioeconomic and political factors most strongly predict national life expectancy, with model selection cross-checked across three criteria and validated two independent ways.",
    github: "https://github.com/zacharyzusin/Linear-Regression-Models-Project",
    visual: "regression",
    tech: ["R", "Statistics", "Regression Analysis"],
    problem:
      "Which socioeconomic and political factors actually predict a country's life expectancy, and how much does each matter once you control for the others? This is a real applied-statistics problem, and doing it rigorously means being careful about model selection and validation, not just fitting one regression and reporting R².",
    approach:
      "Built a multiple linear regression model in R on 165 countries' CIA World Factbook data, engineering log-transforms for skewed predictors and a transportation-infrastructure interaction term, then cross-checked model selection across three independent criteria (Mallows' Cp, AIC, BIC) before validating the final model two separate ways.",
    highlights: [
      "Cross-checked model selection using three independent criteria (Cp, AIC, BIC) rather than trusting a single metric — AIC agreed with Cp on a 12-predictor model, but the smaller BIC-selected 6-predictor model was chosen for parsimony",
      "Engineered a real interaction term (airports + roadways, log-transformed) as a combined transportation-infrastructure proxy, explicitly justified in the write-up",
      "Validated the final model two independent ways — an 80/20 holdout split and a separate 5-fold cross-validation — and got consistent results across both",
      "Full residual diagnostics: studentized deleted residuals plotted against every predictor, fitted values, and observation order, plus a Q-Q plot to check normality",
    ],
    technical: [
      "Final model (6 predictors, chosen via BIC): birth_rate, death_rate, log(GDP PPP per capita), urbanization, democracy_index, health_spend_pct_gdp",
      "Adjusted R² = 0.891, F = 224.5 on 6 and 158 df (p < 2.2×10⁻¹⁶), residual standard error = 2.624",
      "Democracy index coefficient: +0.467 years of life expectancy per unit increase (p = 2.53×10⁻⁴), controlling for the other 5 predictors",
      "Validated with an 80/20 train/test split (MSPE = 7.01) and, separately, 5-fold cross-validation (average MSPE = 7.18) — the two independent validation approaches agree closely",
    ],
    results:
      "The final 6-predictor model explains 89.1% of the variance in national life expectancy (adjusted R², F=224.5, p<2.2×10⁻¹⁶) and predicts held-out countries' life expectancy within about 2.6 years on average (RMSE), with consistent results across both an 80/20 holdout split and independent 5-fold cross-validation.",
    images: [
      {
        src: "/projects/life-expectancy-analysis/pairs_plot.png",
        alt: "Pairwise scatterplot matrix of life expectancy against all 6 final model predictors",
        caption: "Pairwise relationships between life expectancy and the 6 predictors in the final model.",
      },
    ],
  },
  {
    slug: "pos-tagger-state-space-model",
    title: "State Space Model POS Tagger",
    short: "A part-of-speech tagger with hand-derived forward and backward passes through a state-space model — no autodiff.",
    description: "Part-of-speech tagger implemented in MATLAB using a structured state-space model with a bilinear-discretized state transition matrix and manually-derived backpropagation.",
    github: "https://github.com/zacharyzusin/State-Space-Model-POS-Tagger",
    visual: "postag",
    tech: ["MATLAB", "State-Space Models", "NLP"],
    problem:
      "Part-of-speech tagging requires modeling sequential dependencies between words. Most modern taggers reach for an RNN or Transformer and an autodiff framework — I wanted to actually implement the underlying state-space model math by hand, forward and backward, to understand it properly.",
    approach:
      "Built a structured state-space sequence model (the same family of ideas behind S4/Mamba-style models) entirely in MATLAB, including a bilinear (Tustin) discretization of the state transition matrix and a fully hand-derived backward pass — no deep learning framework, no automatic differentiation.",
    highlights: [
      "Hand-derived both the forward AND backward pass through a bilinear-discretized state-space model — gradients for the output layer, classification weights, and convolution kernel are all computed manually via matrix calculus, not autodiff",
      "Forward pass uses the SSM \"convolutional view\": convolves a precomputed kernel over a 4-token context window rather than a step-by-step recurrent scan",
      "Trained on CoNLL 2003, collapsing the dataset's 46 fine-grained POS tags into 4 coarse categories via an explicit mapping",
      "Early stopping after 5 epochs without validation improvement, on top of plain SGD — real training hygiene, not just a fixed epoch count",
    ],
    technical: [
      "State transition matrix discretized via the bilinear (Tustin) transform: disc_state = (I − dt/2·A)⁻¹(I + dt/2·A) — the same discretization method used in S4-family state-space models",
      "Forward pass: hidden state = Σⱼ kernel(j)·u(j) + residual·u, convolving the precomputed kernel over a 4-token context window (hidden dim 64) rather than recurrently stepping through the sequence",
      "Backward pass derived by hand: output-layer gradient via the softmax Jacobian (d_predictions = −(one_hot/pred)), propagated back through the classification weights and the convolution kernel/residual parameters via explicit matrix multiplication; plain SGD updates at lr=0.001",
      "Data: CoNLL 2003 with 46 tags collapsed to 4 (Noun/Verb/Modifier/Other) via explicit tag-code mapping, pretrained 64-dim word2vec embeddings, batch size 32, up to 50 epochs",
    ],
  },
  {
    slug: "cky-parser",
    title: "CKY Parser",
    short: "A probabilistic CYK chart parser with real Parseval evaluation, not just membership checking.",
    description: "Cocke-Kasami-Younger chart parser for context-free grammars, implementing probabilistic (Viterbi) parsing with a full Parseval evaluation harness.",
    github: "https://github.com/zacharyzusin/CKY-Parser",
    visual: "cky",
    tech: ["Python", "NLP", "Parsing Algorithms"],
    problem:
      "Parsing a sentence under a context-free grammar requires handling genuine ambiguity — many different parse trees can be structurally valid, and you need an efficient way to find the most probable one. CKY is the classic dynamic-programming solution.",
    approach:
      "Implemented the full Cocke-Kasami-Younger algorithm from scratch as a probabilistic (Viterbi) parser over a Chomsky Normal Form grammar — including chart construction, backpointer-based tree reconstruction, and a real Parseval-metric evaluation harness, not just a toy that checks whether a sentence parses.",
    highlights: [
      "True Viterbi/probabilistic CKY — tracks log-probabilities and keeps only the max-probability derivation per span, not just grammatical membership",
      "Grammar validation is genuinely careful: uses math.fsum + math.isclose (not naive summation) to verify each nonterminal's rule probabilities actually sum to 1.0",
      "Evaluation implements real Parseval precision/recall/F-score, plus parser coverage — and reports F-score both over parsed-only sentences and over all sentences, so failed parses can't silently inflate the number",
      "Fully dependency-free — pure Python standard library",
    ],
    technical: [
      "Chart is a sparse dict-of-dicts keyed by (i,j) span → nonterminal, storing either the terminal word (length-1 spans) or a backpointer pair to the two child constituents and their split point",
      "Probabilistic scoring: for each span and nonterminal, takes log(rule_prob) + probs[left_child] + probs[right_child] across every valid split point, keeping only the maximum — genuine Viterbi decoding, O(n³·|G|) time",
      "Tree reconstruction recursively walks the backpointers into nested tuples that map directly to Penn Treebank bracket notation",
      "Grammar class indexes rules bidirectionally (by LHS and by RHS) for fast lookup during chart-filling, and rejects any rule with more than 2 RHS symbols (enforcing CNF)",
    ],
  },
  {
    slug: "action-segmentation-mice",
    title: "Action Segmentation in Mice",
    short: "An evaluation pipeline for a neural behavior classifier used in computational neuroscience research.",
    description: "Diagnostic and behavioral-fingerprinting pipeline built around a Temporal Convolutional Network model, evaluating its classification of mouse behavior from multi-modal time-series data across 57 research sessions.",
    github: "https://github.com/zacharyzusin/Neuroscience-Research",
    visual: "timeseries",
    tech: ["Python", "PyTorch", "UMAP", "OpenCV", "Time-Series Analysis"],
    problem:
      "Understanding animal behavior from continuous pose-tracking and sensor data requires segmenting it into discrete, meaningful actions — and once you have a model that does that, you need real tooling to check whether its predictions actually hold up across many different recording sessions and labs, not just one dataset.",
    approach:
      "Built the evaluation and behavioral-fingerprinting pipeline around DAART, a pretrained Temporal Convolutional Network classifier from the International Brain Laboratory (IBL), applying it across 57 real research sessions spanning 8 different labs — pulling data via the IBL's own ONE API and validating predictions both quantitatively and qualitatively.",
    highlights: [
      "Wrote a custom non-uniform Savitzky-Golay filter to smooth pose-tracking data that had irregular dropped/missing frames — the standard scipy implementation only handles uniformly-sampled data",
      "Built an 88-dimensional behavioral \"fingerprint\" per trial (state-duration histograms across time bins and task periods) and visualized cross-session structure with UMAP",
      "Validated the model two ways: quantitatively via macro-averaged F1 agreement scores and event-aligned heatmaps, and qualitatively via frame-by-frame video overlays of predicted states against real footage",
      "Pulled real multi-lab data (57 sessions, 8 IBL labs) via the IBL's ONE API and brainbox tooling, not a single canned dataset",
    ],
    technical: [
      "Loaded a pretrained daart.models.Segmenter (TCN) via PyTorch state dict, ran inference across sessions pulled with one.api.ONE and brainbox.io.one.SessionLoader",
      "Custom non-uniform Savitzky-Golay smoothing: fits a least-squares polynomial per window to handle irregular timestamps from dropped tracking frames, rather than assuming uniform sampling",
      "Feature engineering: pose markers combined with interpolated wheel velocity and derived acceleration, Z-scored, batched at sequence length 15",
      "Behavioral fingerprint: 11 time bins × 2 task periods × 4 behavioral states of state-duration histograms → 88-dim vector per trial → UMAP for 2D cross-session visualization",
    ],
    images: [
      {
        src: "/projects/action-segmentation-mice/mice-architecture.png",
        alt: "DAART semi-supervised temporal convolutional network architecture diagram",
        caption: "The DAART model: an encoder maps behavioral features to a latent embedding, classified against sparse hand labels and dense heuristic labels, with a predictor forecasting future features for self-supervision.",
      },
      {
        src: "/projects/action-segmentation-mice/behavior-panel.png",
        alt: "Composite figure: video-overlay frames per behavioral state, paw-speed transition plots, and aligned discrete-state heatmaps",
        caption: "Top: video frames overlaid with paw position per predicted state (Still, Move, Wheel Turn, Groom). Middle: paw speed aligned to state transitions across trials. Bottom: predicted-state heatmaps for one session, split by correct vs. incorrect trials.",
      },
      {
        src: "/projects/action-segmentation-mice/mice-smoothing-validation.png",
        alt: "Model inference compared across Dropbox, IBL, and IBL-smoothed datasets",
        caption: "Validating the custom smoothing filter: state predictions and time-spent-per-state stay consistent whether run on the original data or the Savitzky-Golay-smoothed version.",
      },
      {
        src: "/projects/action-segmentation-mice/mice-trial-based.png",
        alt: "Per-trial predicted state timeline aligned with wheel velocity and paw position traces",
        caption: "Two individual trials: predicted state sequence lined up against raw wheel velocity and paw position, showing the classifier tracking real behavioral transitions.",
      },
      {
        src: "/projects/action-segmentation-mice/mice-histograms.png",
        alt: "Histograms of time spent in each behavioral state across two trial periods",
        caption: "The raw material for the 88-dim behavioral fingerprint: state-duration histograms across 11 time bins, split by trial period (first movement to feedback vs. feedback to trial end).",
      },
      {
        src: "/projects/action-segmentation-mice/mice-umap.png",
        alt: "UMAP projection of behavioral fingerprints across sessions and trial splits",
        caption: "UMAP projection of the 88-dim behavioral fingerprint — left: across sessions from two data sources; right: even vs. odd trials within a session, checking that a mouse's behavioral signature stays consistent.",
      },
    ],
  },
  {
    slug: "wikipedia-article-clustering",
    title: "Wikipedia Article Clustering",
    short: "An unsupervised pipeline that clusters Wikipedia articles by real semantic similarity.",
    description: "Live-scraped Wikipedia articles, embedded with Sentence-BERT, and clustered with UMAP + K-Means to surface topic structure — visualized as an interactive scatter plot.",
    github: "https://github.com/zacharyzusin/Wikipedia-Article-Clustering",
    visual: "clusters",
    tech: ["Python", "Sentence-BERT", "UMAP", "Scikit-Learn", "NLP"],
    problem:
      "Large text corpora like Wikipedia contain natural topic structure that isn't labeled — surfacing it requires methods that capture real semantic similarity, not just keyword overlap.",
    approach:
      "Built an end-to-end pipeline: live-scrape ~155 real Wikipedia articles across 5 categories via the Wikipedia API, clean and lemmatize the text, embed it with a sentence-transformer model, reduce to 2D with UMAP, and cluster with K-Means — choosing the number of clusters systematically rather than guessing.",
    highlights: [
      "Scrapes real articles live from the Wikipedia API (155 articles, 5 categories) rather than using a prepackaged dataset",
      "Uses Sentence-BERT embeddings (paraphrase-MiniLM-L6-v2) to capture real semantic meaning, not bag-of-words or TF-IDF",
      "Chooses K for K-Means systematically — fits every k from 2 to 19 and selects the one with the highest silhouette score, instead of picking an arbitrary cluster count",
      "Full text cleanup pipeline: citation-marker stripping, tokenization, stopword removal, and lemmatization before embedding",
    ],
    technical: [
      "Embedding: SentenceTransformer('paraphrase-MiniLM-L6-v2') → StandardScaler normalization → UMAP(n_components=2)",
      "Cluster selection: loops k=2..19, fits KMeans(init='k-means++') for each, and keeps the k with the maximum silhouette score",
      "Notable design choice: clustering runs on the 2D UMAP-reduced coordinates rather than the original embedding space — trades some cluster fidelity for the ability to directly visualize and select clusters spatially",
      "Visualization: interactive Plotly scatter, points hover-labeled with the source article title",
    ],
  },
  {
    slug: "neural-dependency-parser",
    title: "Neural Network Dependency Parser",
    short: "A from-scratch neural reimplementation of the classic Chen & Manning transition-based parser.",
    description: "Transition-based dependency parser using a neural network architecture implemented in PyTorch, trained on Penn Treebank annotations.",
    github: "https://github.com/zacharyzusin/Neural-Network-Dependency-Parser",
    visual: "tree",
    tech: ["Python", "PyTorch", "NLP", "Dependency Parsing"],
    problem:
      "Dependency parsing — figuring out which words in a sentence grammatically depend on which — is a foundational NLP task that classical rule-based parsers generalize poorly on.",
    approach:
      "Reimplemented Chen & Manning's (2014) neural transition-based parsing architecture in PyTorch: an arc-standard shift-reduce parser guided by a small neural network that greedily predicts the next parsing action at each step.",
    highlights: [
      "Oracle-based training data generation — walks each gold-standard tree to derive the exact shift/left-arc/right-arc sequence that reproduces it, then trains on those derived action sequences",
      "POS-aware unknown-word handling: unknown proper nouns map to a distinct ⟨NNP⟩ token and unknown numbers to ⟨CD⟩, rather than collapsing all unknowns into one generic ⟨UNK⟩",
      "Greedy decoder validates structural legality (e.g. buffer must be non-empty to shift) before executing the highest-scored action, rather than blindly trusting the model",
      "Full evaluation harness computing both UAS and LAS, each micro- and macro-averaged",
    ],
    technical: [
      "Model: word embeddings (128-dim) for the top-3 stack and top-3 buffer words, flattened to 768 dims → Linear+ReLU (128) → Linear (91 outputs: shift + 45 labels × 2 arc directions)",
      "Trained with Adagrad (lr=0.01), batch size 16, 5 epochs, cross-entropy loss",
      "State representation keeps an explicit stack/buffer array; the oracle derives training labels directly from CoNLL-X-format gold trees",
      "Decoder sorts all legal actions by predicted probability and executes the highest-scoring structurally valid one at each step (pure greedy, no beam search)",
    ],
  },
  {
    slug: "home-cooking-platform",
    title: "Home Cooking Platform",
    short: "A full-stack recipe platform with real multi-constraint search, not a toy CRUD demo.",
    description: "Full-stack Flask + PostgreSQL web application with a 10-table relational schema and dynamic filtering that recommends recipes based on available ingredients, dietary restrictions, cuisine, and complexity — matching all selected constraints at once.",
    github: "https://github.com/zacharyzusin/Home-Cooking-Helper",
    visual: "ingredients",
    tech: ["Flask", "PostgreSQL", "SQLAlchemy", "SQL"],
    problem:
      "Recipe apps often ignore practical constraints — what ingredients you actually have on hand, or real dietary restrictions — and just return anything that loosely matches a search term.",
    approach:
      "Built a full-stack Flask + PostgreSQL application around a real 10-table relational schema, with search logic that dynamically builds parameterized SQL to match ALL of a user's selected ingredients and dietary restrictions at once — not just any of them — plus session-based auth and a live-updating review/rating system.",
    highlights: [
      "10-table relational schema (users, recipes, ingredients, dietary restrictions, nutrition, flavor profiles, saves, reviews) with real indexes on the columns actually queried",
      "Search correctly enforces \"match every selected filter\" using SQL GROUP BY + HAVING, rather than the common mistake of loosely matching any of them",
      "Session-based auth with UUID primary keys and password-length validation",
      "Posting a review updates the recipe's running average rating in the same transaction",
      "Built with the Flask application-factory pattern and Blueprints, split cleanly into main/auth/recipe/user route modules",
    ],
    technical: [
      "Schema: Users, Recipes (with FKs to NutritionalInfo and FlavorProfiles), Ingredients, Contains (recipe↔ingredient join), DietaryRestrictions + CompatibleWith (recipe↔restriction join), Saves, Reviews — indexed on UserID, CuisineType, and AverageRating",
      "Search query joins Contains→Ingredients and CompatibleWith→DietaryRestrictions, groups by recipe, and uses HAVING COUNT(...) to require that a recipe matches every requested ingredient/restriction — the correct SQL pattern for \"match all\" filtering, as opposed to a naive WHERE...IN that would under-constrain results",
      "All queries are raw, parameterized SQL via SQLAlchemy's text() rather than the ORM layer — a deliberate choice for direct control over the dynamic multi-table filter logic",
      "Config layer defines 11 cuisine types and 3 complexity tiers (Beginner / Aspiring Chef / Master Chef) used consistently across search and recipe creation",
    ],
    images: [
      {
        src: "/projects/home-cooking-platform/home.png",
        alt: "Home Cooking Helper search interface with ingredient, cuisine, and dietary restriction filters",
        caption: "The multi-constraint search interface — filters combine via SQL GROUP BY/HAVING to require all selected constraints match.",
      },
      {
        src: "/projects/home-cooking-platform/schema.png",
        alt: "Entity-relationship diagram of the 10-table database schema",
        caption: "The underlying 10-table relational schema.",
      },
    ],
  },
  {
    slug: "tdnn-conformer-asr",
    title: "TDNN-Conformer ASR",
    short: "A hybrid speech recognition architecture combining TDNN with the Conformer model.",
    description: "Novel speech recognition architecture combining Time Delay Neural Networks with the Conformer model. Implemented and trained a 12.5M parameter model using PyTorch and WeNet on the LibriSpeech dataset.",
    github: "https://github.com/zacharyzusin/TDNN-Conformer",
    visual: "waveform",
    tech: ["PyTorch", "WeNet", "torchaudio", "LibriSpeech"],
    problem:
      "Speech recognition models typically lean on either Time Delay Neural Networks (TDNNs) for efficient convolutional temporal modeling, or Conformer blocks for capturing local and global context via self-attention. Combining their strengths in a single architecture is less explored — I wanted to know what a TDNN gets you when it replaces the Conformer's own convolution module rather than sitting alongside it.",
    approach:
      "Built a hybrid encoder that keeps the Conformer's macaron block structure (feed-forward → self-attention → conv module → feed-forward) but replaces the conv module itself with a custom TDNN block, then trained a 12.5M-parameter model end-to-end inside the WeNet ASR toolkit on LibriSpeech.",
    highlights: [
      "Custom TDNN module: pointwise conv → GLU gating → three parallel dilated depthwise convolutions (dilations d, 2d, 3d) → concat → merge → LayerNorm → ReLU",
      "6-block encoder (dim 256, 4 attention heads, relative positional encoding), 6-layer Transformer decoder, 12.5M parameters total",
      "Trained with a hybrid CTC (0.3) / attention (0.7) loss, SpecAugment, speed perturbation, and label smoothing — the standard modern WeNet recipe",
      "Grounded the architecture in the original TDNN literature (Waibel et al., 1989) and factorized-TDNN work (Povey et al., 2018), rather than an ad hoc design",
    ],
    technical: [
      "TDNN module internals: pointwise conv projects to the block width → GLU gate controls information flow → three depthwise convolutions run in parallel at increasing dilation (context sizes d, 2d, 3d) to capture short- and longer-range temporal patterns simultaneously → outputs concatenate and pass through a 1×1 merge conv, LayerNorm, ReLU, and a final pointwise conv",
      "Training recipe: AdamW (β₁=0.9, β₂=0.98), Transformer learning-rate schedule with a 25,000-step warmup to a 0.001 peak, gradient clipping at 10.0, batch size 12",
      "Data: LibriSpeech train-clean-100 (100 hours), 80-dim log-Mel filterbanks (25ms/10ms framing), CMVN normalization, BPE tokenization with a 5,000-token vocabulary",
      "Trained for 35 hours on a single RTX 2070 — a deliberately modest compute budget, so the paper frames results as an isolated comparison of the TDNN swap rather than a state-of-the-art claim",
    ],
    results:
      "On LibriSpeech test-clean, the model reached 14.63% WER via CTC prefix beam search (its best decoding mode) after 35 hours of training on a single consumer GPU. The accompanying write-up is explicit that this trails baseline Conformer variants (2.1–2.7% WER, trained on 960 hours with far more compute) — the goal was an honest, controlled comparison of the architectural change, not a leaderboard result, and the paper says so directly rather than overselling it.",
    images: [
      {
        src: "/projects/tdnn-conformer-asr/architecture.png",
        alt: "TDNN-Conformer encoder architecture diagram",
        caption: "The full encoder pipeline and macaron-style block internals — the TDNN module replaces the Conformer's own convolution module.",
      },
      {
        src: "/projects/tdnn-conformer-asr/tdnn-module.png",
        alt: "TDNN module internal architecture diagram",
        caption: "Inside the TDNN module: pointwise conv → GLU gating → three parallel dilated convolutions → concat → merge.",
      },
      {
        src: "/projects/tdnn-conformer-asr/loss-curve.png",
        alt: "Combined training loss curve over 40,000 steps",
        caption: "Combined CTC/attention training loss (0.3/0.7 blend) over 40k steps on a single RTX 2070.",
      },
      {
        src: "/projects/tdnn-conformer-asr/accuracy-curve.png",
        alt: "Token-level training accuracy curve over 40,000 steps",
        caption: "Token-level accuracy climbing to ~87% over training.",
      },
    ],
  },
  {
    slug: "hierarchical-image-classifier",
    title: "Hierarchical Image Classifier",
    short: "A two-headed fine-tuned ResNet-50 with confidence-based detection of unseen categories.",
    description: "Bird, Dog, or Reptile? — a two-headed ResNet-50 that predicts both a coarse category and a fine-grained sub-class simultaneously, with confidence-threshold detection for categories never seen in training. Built with two Columbia classmates.",
    github: "https://github.com/zacharyzusin/Bird-Cat-Or-Dog",
    visual: "hierarchy",
    tech: ["PyTorch", "torchvision", "ResNet-50", "Computer Vision"],
    problem:
      "Standard flat image classifiers treat every category as equally distinct and have no real way to say \"I don't know\" when they see something outside their training categories — a hierarchical classifier that also knows what it doesn't know is more useful in practice.",
    approach:
      "Working with two Columbia classmates, fully fine-tuned a ResNet-50 backbone with two independent classification heads — one predicting a coarse super-class, one predicting a fine-grained sub-class — trained jointly, plus a confidence-threshold rule to flag inputs the model has never seen a category for. Benchmarked against a CLIP/ViT-B-32 baseline to understand the real tradeoffs of each approach.",
    highlights: [
      "Two-headed architecture on a fully fine-tuned (not frozen) ResNet-50 backbone, trained with two independent cross-entropy losses summed together",
      "Novelty detection via softmax confidence thresholding, flagging inputs whose top prediction confidence falls below a tuned threshold",
      "Directly benchmarked against a CLIP/ViT-B-32 baseline and found a genuine, documented tradeoff rather than a one-sided win",
      "Mixed-precision training with a cosine-annealed learning rate on a Colab T4 GPU",
    ],
    technical: [
      "Backbone: torchvision ResNet-50 (pretrained, fully fine-tuned), final layer replaced with identity → 2048-dim features → two linear heads (coarse super-class + fine-grained sub-class, no additional hidden layers)",
      "Loss = cross-entropy(super-class) + cross-entropy(sub-class), summed and backpropagated jointly; AdamW at lr=1e-4 with cosine annealing (T_max=30)",
      "Novelty detection: torch.where(max_softmax_prob < threshold, novel_class, predicted_class), with separate thresholds tuned per head (τ=0.7 super-class, τ=0.5 sub-class)",
      "Augmentation: random-resized crop, horizontal flip, color jitter, and rotation on training data; center-crop only at eval time",
    ],
    results:
      "On the held-out evaluation leaderboard, the model reached 75.89% overall super-class accuracy and 53.39% sub-class accuracy. Benchmarked directly against a CLIP/ViT-B-32 baseline, the tradeoff was clear and worth documenting honestly: CLIP generalized far better to genuinely novel, unseen categories (80.4% vs. 16.6% accuracy), while this fine-tuned model was substantially stronger at fine-grained sub-classification on categories it had seen (53.4% vs. 13.1%) — a real architectural tradeoff between zero-shot generalization and fine-grained specialization, not a simple win or loss.",
    images: [
      {
        src: "/projects/hierarchical-image-classifier/training_curves.png",
        alt: "Training and validation loss and accuracy curves over 30 epochs",
        caption: "Training curves: loss and super-/sub-class accuracy over 30 epochs.",
      },
    ],
  },
  {
    slug: "trigram-language-model",
    title: "Trigram Language Model",
    short: "A dependency-free statistical language model applied to essay-proficiency classification.",
    description: "Statistical language model using trigram probabilities with linear interpolation smoothing for text generation, perplexity evaluation, and TOEFL essay proficiency classification.",
    github: "https://github.com/zacharyzusin/Trigram-Language-Model",
    visual: "ngram",
    tech: ["Python", "NLP", "Statistical Language Modeling"],
    problem:
      "Before neural language models, statistical n-gram models were the standard approach to scoring how fluent a piece of text is — and they're still a clean way to build a fully interpretable, explainable classifier.",
    approach:
      "Built a trigram language model from scratch — pure Python, no libraries — with linearly-interpolated smoothing across unigram/bigram/trigram probabilities, then applied it to a real, practical task: classifying TOEFL essays by English proficiency level based on which of two differently-trained models finds the essay more \"fluent\" (lower perplexity).",
    highlights: [
      "Fully dependency-free — no NumPy, no NLTK, just the Python standard library",
      "Applies the language model to a genuinely interpretable classification task (essay proficiency via perplexity comparison) rather than stopping at a perplexity number",
      "Evaluated on the Brown Corpus with proper START/STOP padding and closed-vocabulary UNK handling",
      "Correct perplexity computation (2^(−average log₂ probability)) using consistent base-2 logs throughout",
    ],
    technical: [
      "Counts unigrams, bigrams, and trigrams in separate hash maps; raw MLE probability = count(w₁,w₂,w₃) / count(w₁,w₂), with a 1/N fallback to avoid divide-by-zero on unseen contexts",
      "Smoothing: linear interpolation with fixed, equal weights (λ₁=λ₂=λ₃=1/3) across all three n-gram orders — a deliberately simple, fixed-weight scheme rather than a tuned or Kneser-Ney backoff",
      "Vocabulary built from words occurring more than once in training; everything else maps to a single UNK token (closed-vocabulary LM)",
      "Essay classification: trains two separate TrigramModel instances (one per proficiency corpus), then classifies each test essay by whichever model assigns it lower perplexity",
    ],
  },
  {
    slug: "wonderful-workouts",
    title: "Wonderful Workouts",
    short: "A weight-training education platform with a hand-built drag-and-drop routine builder.",
    description: "Weight training education platform with a hand-built HTML5 drag-and-drop routine builder, muscle-group coverage validation, a knowledge-check quiz, and PDF export.",
    github: "https://github.com/zacharyzusin/Wonderful-Workouts",
    visual: "reps",
    tech: ["Flask", "JavaScript", "HTML5", "WeasyPrint"],
    problem:
      "Beginners to weight training often lack accessible, structured guidance on proper technique and how to build a program that actually covers the major muscle groups.",
    approach:
      "Built a Flask + vanilla JavaScript app centered on an interactive drag-and-drop routine builder — implemented with native HTML5 drag-and-drop rather than a library — that visually highlights muscle groups as exercises are added, enforces balanced program design before unlocking a knowledge quiz, and exports the finished routine as a PDF.",
    highlights: [
      "Hand-built the drag-and-drop routine builder with native HTML5 drag-and-drop events, not a JS library",
      "Body-silhouette overlay highlights the specific muscle groups covered as exercises are added to a routine — real interactive UI logic, not a static image",
      "Client-side business rule: the quiz stays locked until both routines collectively cover all 4 muscle groups, enforcing balanced program design before letting the user proceed",
      "PDF export pipeline via WeasyPrint renders the finished routine to a downloadable PDF — a genuinely non-trivial feature the README doesn't even mention",
    ],
    technical: [
      "10 hardcoded exercises with real anatomical descriptions (e.g. bench press \"targets the pectoralis major... also hits the triceps and front deltoids\"), split into upper/lower body",
      "drag()/drop() handlers move exercises between a shared pool and two routine lists; a bodyParts map associates each exercise with the muscle group(s) it trains, driving a highlightBodyPart() function that overlays highlighting on front/back body silhouettes",
      "checkRoutineCoverage() gates the quiz button behind both routines together covering all 4 muscle groups (Chest/Back/Arms/Legs)",
      "Backend keeps routine state in global Python lists rather than a database or session — a real architectural tradeoff, reasonable for a single-user prototype focused on the interaction design, but worth being upfront about rather than implying multi-user persistence",
    ],
    images: [
      {
        src: "/projects/wonderful-workouts/home.png",
        alt: "Wonderful Workouts homepage",
        caption: "The app's homepage.",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
