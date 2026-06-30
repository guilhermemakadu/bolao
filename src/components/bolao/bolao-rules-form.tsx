"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BolaoRules } from "@/lib/bolao/rules";
import { deleteBolaoAction, updateOpenRulesAction } from "@/services/bolao-actions";

type BolaoRulesFormProps = {
  poolId: string;
  poolName: string;
  initialRules: BolaoRules;
  canDelete: boolean;
};

export function BolaoRulesForm({
  poolId,
  poolName,
  initialRules,
  canDelete,
}: BolaoRulesFormProps) {
  const t = useTranslations("bolaoRules");
  const router = useRouter();
  const [rules, setRules] = useState<BolaoRules>(initialRules);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const result = await updateOpenRulesAction(poolId, rules);
    setIsSubmitting(false);

    if (!result.success) {
      setError(t(`errors.${result.error}` as "errors.unknownError"));
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm(t("deleteConfirm", { name: poolName }))) return;

    setIsSubmitting(true);
    setError(null);

    const result = await deleteBolaoAction(poolId);
    setIsSubmitting(false);

    if (!result.success) {
      setError(t(`errors.${result.error}` as "errors.unknownError"));
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("title", { name: poolName })}</CardTitle>
        <p className="text-sm text-slate-600">{t("description")}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-900">{t("modesLabel")}</legend>
          {(
            [
              ["exactScore", t("modes.exactScore")],
              ["result", t("modes.result")],
              ["tournamentExtras", t("modes.tournamentExtras")],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={rules.modes[key]}
                onChange={(event) =>
                  setRules({
                    ...rules,
                    modes: { ...rules.modes, [key]: event.target.checked },
                  })
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="col-span-full text-sm font-medium text-slate-900">
            {t("pointsLabel")}
          </legend>
          {rules.modes.exactScore && (
            <div className="space-y-2">
              <Label htmlFor="edit-points-exact">{t("points.exactScore")}</Label>
              <Input
                id="edit-points-exact"
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
              <Label htmlFor="edit-points-result">{t("points.result")}</Label>
              <Input
                id="edit-points-result"
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
                <Label htmlFor="edit-points-champion">{t("points.champion")}</Label>
                <Input
                  id="edit-points-champion"
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
                <Label htmlFor="edit-points-top-scorer">{t("points.topScorer")}</Label>
                <Input
                  id="edit-points-top-scorer"
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

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-700">{t("success")}</p>}

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {t("save")}
          </Button>
          {canDelete && (
            <Button type="button" variant="outline" onClick={handleDelete} disabled={isSubmitting}>
              {t("delete")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
