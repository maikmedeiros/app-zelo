'use client';

import { useState } from 'react';
import { Avatar } from '@/shared/components/avatar';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Badge } from '@/shared/components/badge';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { Combobox } from '@/shared/components/combobox';
import { ConsentBadge } from '@/shared/components/consent-badge';
import { DataTable } from '@/shared/components/data-table';
import { DatePicker } from '@/shared/components/date-picker';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/dialog';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { Field, describedBy } from '@/shared/components/field';
import { FileDropzone } from '@/shared/components/file-dropzone';
import { Gallery } from '@/shared/components/gallery';
import { IconButton } from '@/shared/components/icon-button';
import { Input } from '@/shared/components/input';
import { LevelPicker, type ReportLevel } from '@/shared/components/level-picker';
import { Select } from '@/shared/components/select';
import { Skeleton, SkeletonText } from '@/shared/components/skeleton';
import { Switch } from '@/shared/components/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/tabs';
import { Textarea } from '@/shared/components/textarea';
import { useToast } from '@/shared/components/toast';
import { Trash2 } from 'lucide-react';

const PEOPLE = [
  { value: '1', label: 'Ana Ribeiro', hint: 'Professora · Maternal I A' },
  { value: '2', label: 'Bruno Carvalho', hint: 'Responsável · Théo' },
  { value: '3', label: 'Diana Esteves', hint: 'Coordenação' },
];

const ROWS = {
  results: [
    { id: '1', name: 'Théo Carvalho', turma: 'Maternal I A' },
    { id: '2', name: 'Lívia Duarte', turma: 'Maternal II B' },
  ],
  page: 1,
  limit: 20,
  totalResults: 2,
  totalPages: 1,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4">
        {children}
      </div>
    </section>
  );
}

export function UiCatalog() {
  const toast = useToast();
  const [person, setPerson] = useState<string | null>(null);
  const [level, setLevel] = useState<ReportLevel>('EM_DESENVOLVIMENTO');
  const [files, setFiles] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-8">
      <Section title="Botões">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Publicar</Button>
          <Button variant="secondary">Salvar rascunho</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="danger">Remover</Button>
          <Button disabled>Desabilitado</Button>
          <Button size="sm">Pequeno</Button>
          <IconButton label="Excluir">
            <Trash2 aria-hidden className="size-5" />
          </IconButton>
        </div>
      </Section>

      <Section title="Campos">
        <Field id="nome" label="Nome" required>
          <Input id="nome" placeholder="Ana Ribeiro" />
        </Field>

        <Field id="email" label="E-mail" error="Informe um e-mail válido">
          <Input id="email" aria-invalid aria-describedby={describedBy('email', undefined, 'x')} />
        </Field>

        <Field id="obs" label="Observação" hint="Aparece para a família.">
          <Textarea id="obs" />
        </Field>

        <Field id="turno" label="Turno">
          <Select
            id="turno"
            options={[
              { value: 'MANHA', label: 'Manhã' },
              { value: 'TARDE', label: 'Tarde' },
              { value: 'INTEGRAL', label: 'Integral' },
            ]}
          />
        </Field>

        <Field id="pessoa" label="Pessoa">
          <Combobox id="pessoa" value={person} onChange={setPerson} options={PEOPLE} />
        </Field>

        <Field id="data" label="Data de referência">
          <DatePicker id="data" />
        </Field>

        <Checkbox id="consentir" label="Pode assinar consentimento" />
        <Switch id="email-notif" label="Receber aviso por e-mail" />
      </Section>

      <Section title="Selos e identidade">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Neutro</Badge>
          <Badge tone="brand">Turma A</Badge>
          <Badge tone="accent">Rascunho</Badge>
          <Badge tone="danger">Removida</Badge>
          <Badge tone="success">Publicada</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ConsentBadge type="IMAGEM_INTERNA" state="granted" />
          <ConsentBadge type="IMAGEM_EXTERNA" state="denied" />
          <ConsentBadge type="TRATAMENTO_BIOMETRICO" state="missing" />
        </div>

        <div className="flex items-center gap-3">
          <Avatar name="Ana Ribeiro" size="sm" />
          <Avatar name="Bruno Carvalho" />
          <Avatar name="Diana Esteves" size="lg" />
        </div>
      </Section>

      <Section title="Relatório">
        <LevelPicker
          name="acolhimento"
          legend="Acolhimento"
          value={level}
          onValueChange={setLevel}
        />
      </Section>

      <Section title="Sobreposições">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Abrir diálogo</Button>
            </DialogTrigger>
            <DialogContent title="Editar turma" description="Alterações valem a partir de agora.">
              <Field id="turma" label="Nome da turma">
                <Input id="turma" defaultValue="Maternal I A" />
              </Field>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="danger">Confirmar remoção</Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              title="Remover a postagem?"
              description="A família deixa de ver este registro. A ação não pode ser desfeita."
              confirmLabel="Remover"
              onConfirm={() => toast.show({ title: 'Postagem removida', tone: 'success' })}
            />
          </AlertDialog>

          <Button
            variant="secondary"
            onClick={() =>
              toast.show({ title: 'Rascunho salvo', description: 'Continue quando quiser.' })
            }
          >
            Disparar aviso
          </Button>
        </div>
      </Section>

      <Section title="Abas">
        <Tabs defaultValue="alunos">
          <TabsList>
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
            <TabsTrigger value="professores">Professores</TabsTrigger>
            <TabsTrigger value="postagens">Postagens</TabsTrigger>
          </TabsList>
          <TabsContent value="alunos" className="py-4">
            Lista de alunos da turma.
          </TabsContent>
          <TabsContent value="professores" className="py-4">
            Titular, auxiliar e volante.
          </TabsContent>
          <TabsContent value="postagens" className="py-4">
            Feed filtrado pela turma.
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Tabela">
        <DataTable
          data={ROWS}
          rowKey={(row) => row.id}
          emptyTitle="Nenhum aluno por aqui"
          columns={[
            { key: 'name', header: 'Aluno', cell: (row) => row.name },
            { key: 'turma', header: 'Turma', cell: (row) => row.turma },
          ]}
        />
      </Section>

      <Section title="Estados">
        <EmptyState
          title="Ana ainda não tem turma neste ano"
          description="Matricule a criança para que a agenda comece a aparecer."
          action={<Button size="sm">Matricular</Button>}
        />
        <ErrorState onRetry={() => toast.show({ title: 'Tentando de novo' })} />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <SkeletonText />
        </div>
      </Section>

      <Section title="Mídia">
        <FileDropzone multiple onFiles={(list) => setFiles(list.map((file) => file.name))} />
        {files.length > 0 && <p className="text-sm text-text-muted">Aceitos: {files.join(', ')}</p>}

        <Gallery
          items={[
            { id: '1', src: '/next.svg', alt: 'Exemplo 1' },
            { id: '2', src: '/vercel.svg', alt: 'Exemplo 2' },
          ]}
        />
      </Section>

      <Section title="Navegação">
        <Breadcrumbs
          items={[
            { label: 'Turmas', href: '/classes' },
            { label: 'Maternal I A', href: '/classes/1' },
            { label: 'Consentimentos' },
          ]}
        />
      </Section>
    </div>
  );
}
