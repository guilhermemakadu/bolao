"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BolaoRules } from "@/lib/bolao/rules";
import { DEFAULT_BOLAO_RULES } from "@/lib/bolao/rules";
import {
  createDraftBolaoAction,
  finalizeBolaoAction,
  saveWizardModesAction,
  saveWizardPointsAction,
  saveWizardTiebreakerAction,
} from "@/services/bolao-actions";

type CompetitionOption = {
  id: string;
  name: string;
  season: string | null;
};

type BolaoWizardProps = {
  competitions: CompetitionOption[];
  initialPoolId?: string;
  initialRules?: BolaoRules;
};

const STEPS = ["competition", "modes", "points", "tiebreaker", "details"] as const;
type WizardStep = (typeof STEPS)[number];

function getActionError(result: { success: false; error: string } | { success: true }): string {
  return result.success ? "unknownError" : result.error;
}

export function BolaoWizard({ competitions, initialPoolId, initialRules }: BolaoWizardProps) {
  const t = useTranslations("wizard");
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>(initialPoolId ? "modes" : "competition");
  const [poolId, setPoolId] = useState<string | undefined>(initialPoolId);
  const [rules, setRules] = useState<BolaoRules>(initialRules ?? DEFAULT_BOLAO_RULES);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const stepLabels: Record<WizardStep, string> = {
    competition: t("steps.competition"),
    modes: t("steps.modes"),
    points: t("steps.points"),
    tiebreaker: t("steps.tiebreaker"),
    details: t("steps.details"),
  };

  async function handleCompetitionNext() {
    if (!selectedCompetitionId) {
      setError(t("errors.competitionRequired"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    if (poolId) {
      setStep("modes");
      setIsSubmitting(false);
      return;
    }

    const result = await createDraftBolaoAction(selectedCompetitionId);
    setIsSubmitting(false);

    if (!result.success) {
      setError(t(`errors.${getActionError(result)}` as "errors.unknownError"));
      return;
    }
    if (!result.poolId) {
      setError(t("errors.unknownError"));
      return;
    }

    setPoolId(result.poolId);
    setStep("modes");
  }

  async function handleModesNext() {
    if (!poolId) return;
    setIsSubmitting(true);
    setError(null);

    const result = await saveWizardModesAction(poolId, rules.modes);
    setIsSubmitting(false);

    if (!result.success) {
      setError(t(`errors.${getActionError(result)}` as "errors.unknownError"));
      return;
    }

    setStep("points");
  }

  async function handlePointsNext() {
    if (!poolId) return;
    setIsSubmitting(true);
    setError(null);

    const result = await saveWizardPointsAction(poolId, rules.points);
    setIsSubmitting(false);

    if (!result.success) {
      setError(t(`errors.${getActionError(result)}` as "errors.unknownError"));
      return;
    }

    setStep("tiebreaker");
  }

  async function handleTiebreakerNext() {
    if (!poolId) return;
    setIsSubmitting(true);
    setError(null);

    const result = await saveWizardTiebreakerAction(poolId, rules.tiebreaker);
    setIsSubmitting(false);

    if (!result.success) {
      setError(t(`errors.${getActionError(result)}` as "errors.unknownError"));
      return;
    }

    setStep("details");
  }

  async function handleFinalize() {
    if (!poolId) return;
    if (!name.trim()) {
      setError(t("errors.nameRequired"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await finalizeBolaoAction(poolId, {
      name,
      description: description || undefined,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(t(`errors.${getActionError(result)}` as "errors.unknownError"));
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function goBack() {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <p className="text-sm text-slate-600">
          {t("stepProgress", { current: stepIndex + 1, total: STEPS.length })} — {stepLabels[step]}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "competition" && (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-900">{t("competition.label")}</legend>
            {competitions.map((competition) => (
              <label
                key={competition.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 has-checked:border-emerald-500 has-checked:bg-emerald-50"
              >
                <input
                  type="radio"
                  name="competition"
                  value={competition.id}
                  checked={selectedCompetitionId === competition.id}
                  onChange={() => setSelectedCompetitionId(competition.id)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-slate-900">{competition.name}</span>
                  {competition.season && (
                    <span className="text-sm text-slate-600">{competition.season}</span>
                  )}
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {step === "modes" && (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-900">{t("modes.label")}</legend>
            {(
              [
                ["exactScore", t("modes.exactScore"), t("modes.exactScoreHint")],
                ["result", t("modes.result"), t("modes.resultHint")],
                ["tournamentExtras", t("modes.tournamentExtras"), t("modes.tournamentExtrasHint")],
              ] as const
            ).map(([key, label, hint]) => (
              <label
                key={key}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 has-checked:border-emerald-500 has-checked:bg-emerald-50"
              >
                <input
                  type="checkbox"
                  checked={rules.modes[key]}
                  onChange={(event) =>
                    setRules({
                      ...rules,
                      modes: { ...rules.modes, [key]: event.target.checked },
                    })
                  }
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-slate-900">{label}</span>
                  <span className="text-sm text-slate-600">{hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {step === "points" && (
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="col-span-full text-sm font-medium text-slate-900">
              {t("points.label")}
            </legend>
            {rules.modes.exactScore && (
              <div className="space-y-2">
                <Label htmlFor="points-exact">{t("points.exactScore")}</Label>
                <Input
                  id="points-exact"
                  type="number"
                  min={0}
                  max={100}
                  value={rules.points.exactScore}
                  onChange={(event) =>
                    setRules({
                      ...rules,
                      points: { ...rules.points, exactScore: Number(event.target.value) },
                    })
                  }
                />
              </div>
            )}
            {rules.modes.result && (
              <div className="space-y-2">
                <Label htmlFor="points-result">{t("points.result")}</Label>
                <Input
                  id="points-result"
                  type="number"
                  min={0}
                  max={100}
                  value={rules.points.result}
                  onChange={(event) =>
                    setRules({
                      ...rules,
                      points: { ...rules.points, result: Number(event.target.value) },
                    })
                  }
                />
              </div>
            )}
            {rules.modes.tournamentExtras && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="points-champion">{t("points.champion")}</Label>
                  <Input
                    id="points-champion"
                    type="number"
                    min={0}
                    max={100}
                    value={rules.points.champion}
                    onChange={(event) =>
                      setRules({
                        ...rules,
                        points: { ...rules.points, champion: Number(event.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points-top-scorer">{t("points.topScorer")}</Label>
                  <Input
                    id="points-top-scorer"
                    type="number"
                    min={0}
                    max={100}
                    value={rules.points.topScorer}
                    onChange={(event) =>
                      setRules({
                        ...rules,
                        points: { ...rules.points, topScorer: Number(event.target.value) },
                      })
                    }
                  />
                </div>
              </>
            )}
          </fieldset>
        )}

        {step === "tiebreaker" && (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-900">{t("tiebreaker.label")}</legend>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 has-checked:border-emerald-500 has-checked:bg-emerald-50">
              <input
                type="radio"
                name="tiebreaker"
                checked={rules.tiebreaker === "most_exact_scores"}
                onChange={() => setRules({ ...rules, tiebreaker: "most_exact_scores" })}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-slate-900">
                  {t("tiebreaker.mostExactScores")}
                </span>
                <span className="text-sm text-slate-600">{t("tiebreaker.mostExactScoresHint")}</span>
              </span>
            </label>
          </fieldset>
        )}

        {step === "details" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bolao-name">{t("details.name")}</Label>
              <Input
                id="bolao-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bolao-description">{t("details.description")}</Label>
              <Input
                id="bolao-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-slate-500">{t("details.descriptionHint")}</p>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-wrap gap-3">
          {stepIndex > 0 && (
            <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>
              {t("back")}
            </Button>
          )}
          {step === "competition" && (
            <Button type="button" onClick={handleCompetitionNext} disabled={isSubmitting}>
              {t("next")}
            </Button>
          )}
          {step === "modes" && (
            <Button type="button" onClick={handleModesNext} disabled={isSubmitting}>
              {t("next")}
            </Button>
          )}
          {step === "points" && (
            <Button type="button" onClick={handlePointsNext} disabled={isSubmitting}>
              {t("next")}
            </Button>
          )}
          {step === "tiebreaker" && (
            <Button type="button" onClick={handleTiebreakerNext} disabled={isSubmitting}>
              {t("next")}
            </Button>
          )}
          {step === "details" && (
            <Button type="button" onClick={handleFinalize} disabled={isSubmitting}>
              {t("finish")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
