'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isApiError, fieldErrorsFrom } from '@/shared/api/errors';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Select } from '@/shared/components/select';
import { Textarea } from '@/shared/components/textarea';
import { useToast } from '@/shared/components/toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { ptBR } from '@/shared/i18n/pt-BR';
import { createPost } from '../api/create-post.client';
import { publishPost } from '../api/publish-post.client';
import { updatePost } from '../api/update-post.client';
import { createPostSchema } from '../schemas/create-post';
import { POST_TYPES, type MediaOutput, type PostOutput, type PostType } from '../types';
import { AudiencePicker, type AudienceValue } from './audience-picker';
import { MediaManager } from './media-manager';

type Step = 'audiencia' | 'conteudo' | 'midia';

const STEPS: { id: Step; label: string }[] = [
  { id: 'audiencia', label: 'Quem recebe' },
  { id: 'conteudo', label: 'Conteúdo' },
  { id: 'midia', label: 'Imagens' },
];

const today = (): string => new Date().toISOString().slice(0, 10);

export function PostComposer({ post }: { post?: PostOutput }) {
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState<Step>('audiencia');
  const [draft, setDraft] = useState<PostOutput | null>(post ?? null);
  const [media, setMedia] = useState<MediaOutput[]>(
    (post?.media ?? []).map((item) => ({ ...item, postId: post?.id ?? '', createdAt: '' })),
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [audience, setAudience] = useState<AudienceValue>({
    audience: post?.audience ?? 'TURMA',
    classIds: post?.classes.map((item) => item.id) ?? [],
    studentIds: post?.students.map((item) => item.id) ?? [],
  });

  const [type, setType] = useState<PostType>(post?.type ?? 'REGISTRO_DIARIO');
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [referenceDate, setReferenceDate] = useState(post?.referenceDate.slice(0, 10) ?? today());

  const payload = () => ({
    audience: audience.audience,
    classIds: audience.classIds,
    studentIds: audience.studentIds,
    type,
    title: title.trim().length > 0 ? title.trim() : null,
    body: body.trim().length > 0 ? body.trim() : null,
    referenceDate,
  });

  const save = async (): Promise<PostOutput | null> => {
    const parsed = createPostSchema.safeParse(payload());

    if (!parsed.success) {
      const found: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.') || 'form';
        found[key] ??= issue.message;
      }
      setErrors(found);
      return null;
    }

    setErrors({});
    setSaving(true);

    try {
      const saved =
        draft === null ? await createPost(parsed.data) : await updatePost(draft.id, parsed.data);

      setDraft(saved);
      return saved;
    } catch (error) {
      if (isApiError(error) && error.statusCode === 400) setErrors(fieldErrorsFrom(error.cause));

      toast.show({
        title: 'Não foi possível salvar o rascunho',
        description: isApiError(error) ? error.message : undefined,
        tone: 'danger',
      });

      return null;
    } finally {
      setSaving(false);
    }
  };

  const goTo = async (next: Step) => {
    const saved = await save();
    if (saved !== null) setStep(next);
  };

  const publish = async () => {
    const saved = await save();
    if (saved === null) return;

    try {
      await publishPost(saved.id);
      toast.show({ title: 'Postagem publicada', tone: 'success' });
      router.push(`/feed/${saved.id}`);
      router.refresh();
    } catch (error) {
      toast.show({
        title: 'Não foi possível publicar',
        description: isApiError(error) ? error.message : undefined,
        tone: 'danger',
      });
    }
  };

  const currentIndex = STEPS.findIndex((item) => item.id === step);

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-wrap gap-2" aria-label="Etapas">
        {STEPS.map((item, index) => (
          <li key={item.id}>
            <span
              aria-current={item.id === step ? 'step' : undefined}
              className={
                item.id === step
                  ? 'flex min-h-11 items-center rounded-control bg-brand-soft px-3 text-sm font-medium text-brand'
                  : 'flex min-h-11 items-center rounded-control px-3 text-sm text-text-muted'
              }
            >
              {index + 1}. {item.label}
            </span>
          </li>
        ))}
      </ol>

      {step === 'audiencia' && (
        <AudiencePicker
          value={audience}
          onChange={setAudience}
          error={errors.classIds ?? errors.studentIds}
        />
      )}

      {step === 'conteudo' && (
        <div className="flex flex-col gap-4">
          <Field id="tipo" label="Tipo">
            <Select
              id="tipo"
              value={type}
              onValueChange={(value) => setType(value as PostType)}
              options={POST_TYPES.map((option) => ({
                value: option,
                label: ptBR.enums.postType[option],
              }))}
            />
          </Field>

          <Field id="titulo" label="Título" error={errors.title}>
            <Input
              id="titulo"
              value={title}
              maxLength={200}
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={errors.title !== undefined}
            />
          </Field>

          <Field id="corpo" label="Texto" error={errors.body}>
            <Textarea
              id="corpo"
              rows={8}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              aria-invalid={errors.body !== undefined}
            />
          </Field>

          <Field id="referencia" label="Data de referência" error={errors.referenceDate}>
            <DatePicker
              id="referencia"
              value={referenceDate}
              onChange={(event) => setReferenceDate(event.target.value)}
            />
          </Field>
        </div>
      )}

      {step === 'midia' &&
        (draft === null ? (
          <p className="text-text-muted">Salve o rascunho antes de anexar imagens.</p>
        ) : (
          <MediaManager postId={draft.id} media={media} onChange={setMedia} />
        ))}

      {errors.form !== undefined && (
        <p role="alert" className="text-sm text-danger">
          {errors.form}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {currentIndex > 0 && (
          <Button
            variant="ghost"
            disabled={saving}
            onClick={() => setStep(STEPS[currentIndex - 1]?.id ?? 'audiencia')}
          >
            Voltar
          </Button>
        )}

        {currentIndex < STEPS.length - 1 ? (
          <Button
            disabled={saving}
            onClick={() => void goTo(STEPS[currentIndex + 1]?.id ?? 'conteudo')}
          >
            {saving ? 'Salvando…' : 'Salvar e continuar'}
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={saving}>Publicar</Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              title="Publicar a postagem?"
              description="As famílias passam a ver este registro. Depois de publicado, não dá para voltar ao rascunho."
              confirmLabel="Publicar"
              confirmVariant="primary"
              pending={saving}
              onConfirm={() => void publish()}
            />
          </AlertDialog>
        )}

        <Button variant="secondary" disabled={saving} onClick={() => void save()}>
          Salvar rascunho
        </Button>
      </div>
    </div>
  );
}
