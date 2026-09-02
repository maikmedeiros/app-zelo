'use client';

import { FileWarning } from 'lucide-react';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Select } from '@/shared/components/select';
import { Textarea } from '@/shared/components/textarea';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { useFindListGuardianLinks } from '@/modules/guardian-links/api/find-list-guardian-links.client';
import { createConsent } from '../api/create-consent.client';
import { createConsentSchema } from '../schemas/consents';
import { CONSENT_ORIGINS, CONSENT_TYPES, type ConsentOrigin, type ConsentType } from '../types';

const TYPE_OPTIONS = CONSENT_TYPES.map((type) => ({
  value: type,
  label: ptBR.enums.consentType[type],
}));

const ORIGIN_OPTIONS = CONSENT_ORIGINS.map((origin) => ({
  value: origin,
  label: ptBR.enums.consentOrigin[origin],
}));

const DECISION_OPTIONS = [
  { value: 'true', label: 'Autoriza' },
  { value: 'false', label: 'Não autoriza' },
];

const ORIGIN_HINT: Record<ConsentOrigin, string> = {
  TERMO_MATRICULA: 'O que a família assinou no ato da matrícula.',
  PORTAL_RESPONSAVEL: 'Reservada ao próprio responsável registrando por si.',
  IMPORTACAO: 'Veio de um sistema anterior, com a data de origem preservada.',
  SOLICITACAO_VERBAL: 'Dito de viva-voz. Exige o documento que comprova o pedido.',
};

export interface ConsentDialogProps {
  studentId: string;
  studentName: string;
  initialType?: ConsentType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsentDialog({
  studentId,
  studentName,
  initialType,
  open,
  onOpenChange,
}: ConsentDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();
  const canSeeLinks = useCan(Feature.GuardianLinkView);

  const links = useFindListGuardianLinks({ studentId, active: true, limit: 100 }, canSeeLinks);

  const [type, setType] = useState<ConsentType>(initialType ?? 'IMAGEM_INTERNA');
  const [granted, setGranted] = useState(true);
  const [origin, setOrigin] = useState<ConsentOrigin>('TERMO_MATRICULA');
  const [guardianId, setGuardianId] = useState('');
  const [documentKey, setDocumentKey] = useState('');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const signatories = (links.data?.results ?? []).filter((link) => link.canConsent);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createConsentSchema.safeParse({
      type,
      granted,
      origin,
      ...(guardianId === '' ? {} : { guardianId }),
      ...(documentKey.trim() === '' ? {} : { documentKey }),
      ...(note.trim() === '' ? {} : { note }),
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setFormError(issue?.message);
      return;
    }

    await run(() => createConsent(studentId, parsed.data), {
      success: 'Consentimento registrado',
      failure: 'Não foi possível registrar',
      onSuccess: () => {
        setDocumentKey('');
        setNote('');
        onOpenChange(false);
      },
    });
  };

  const verbalMissingDocument = origin === 'SOLICITACAO_VERBAL' && documentKey.trim() === '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Registrar consentimento"
        description={`Um fato datado sobre ${studentName}. Registrar não altera o passado: encerra a vigência anterior e abre outra.`}
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-consentimento" disabled={pending}>
              {pending ? 'Salvando…' : 'Registrar'}
            </Button>
          </>
        }
      >
        <form
          id="formulario-consentimento"
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Field id="consentimento-tipo" label="Tipo" required error={fieldErrors.type}>
            <Select
              id="consentimento-tipo"
              value={type}
              onValueChange={(value) => setType(value as ConsentType)}
              options={TYPE_OPTIONS}
            />
          </Field>

          <Field id="consentimento-decisao" label="Decisão" required error={fieldErrors.granted}>
            <Select
              id="consentimento-decisao"
              value={granted ? 'true' : 'false'}
              onValueChange={(value) => setGranted(value === 'true')}
              options={DECISION_OPTIONS}
            />
          </Field>

          <Field
            id="consentimento-origem"
            label="Origem"
            hint={ORIGIN_HINT[origin]}
            required
            error={fieldErrors.origin}
          >
            <Select
              id="consentimento-origem"
              value={origin}
              onValueChange={(value) => setOrigin(value as ConsentOrigin)}
              options={ORIGIN_OPTIONS}
            />
          </Field>

          {origin === 'SOLICITACAO_VERBAL' && (
            <Field
              id="consentimento-documento"
              label="Documento comprobatório"
              hint="A chave do arquivo digitalizado — o termo assinado, a ata, o e-mail impresso."
              required
              error={fieldErrors.documentKey ?? (verbalMissingDocument ? formError : undefined)}
            >
              <Input
                id="consentimento-documento"
                value={documentKey}
                maxLength={500}
                aria-invalid={fieldErrors.documentKey !== undefined || verbalMissingDocument}
                onChange={(event) => setDocumentKey(event.target.value)}
              />
            </Field>
          )}

          {canSeeLinks && (
            <Field
              id="consentimento-responsavel"
              label="Responsável signatário"
              hint={
                signatories.length === 0
                  ? 'Nenhum responsável desta criança pode assinar hoje. Ajuste o vínculo antes de indicar alguém.'
                  : 'Quem assinou pela criança. Só aparece quem tem vínculo vigente com autorização para consentir.'
              }
              error={fieldErrors.guardianId}
            >
              <Select
                id="consentimento-responsavel"
                value={guardianId === '' ? 'nenhum' : guardianId}
                onValueChange={(value) => setGuardianId(value === 'nenhum' ? '' : value)}
                disabled={signatories.length === 0}
                options={[
                  { value: 'nenhum', label: 'Sem responsável indicado' },
                  ...signatories.map((link) => ({
                    value: link.guardianId,
                    label: `${link.guardianName} · ${ptBR.enums.relationship[link.relationship]}`,
                  })),
                ]}
              />
            </Field>
          )}

          <Field
            id="consentimento-observacao"
            label="Observação"
            hint="Opcional. O contexto que a linha do histórico não conta sozinha."
            error={fieldErrors.note}
          >
            <Textarea
              id="consentimento-observacao"
              value={note}
              rows={3}
              maxLength={1000}
              aria-invalid={fieldErrors.note !== undefined}
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>

          {formError !== undefined && !verbalMissingDocument && (
            <p role="alert" className="flex items-start gap-2 text-sm text-danger">
              <FileWarning aria-hidden className="mt-0.5 size-4 shrink-0" />
              {formError}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
