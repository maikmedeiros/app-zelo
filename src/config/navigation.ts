import type { LucideIcon } from 'lucide-react';
import {
  BookOpenCheck,
  CalendarRange,
  ClipboardList,
  FileText,
  GraduationCap,
  Home,
  IdCard,
  KeyRound,
  Link2,
  PenSquare,
  School,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
} from 'lucide-react';
import { Feature } from './features';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  feature?: Feature;
  primary?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAVIGATION: NavGroup[] = [
  {
    label: 'Dia a dia',
    items: [
      { href: '/feed', label: 'Feed', icon: Home, feature: Feature.PostView, primary: true },
      {
        href: '/feed/nova',
        label: 'Nova postagem',
        icon: PenSquare,
        feature: Feature.PostCreate,
        primary: true,
      },
      {
        href: '/students',
        label: 'Alunos',
        icon: GraduationCap,
        feature: Feature.StudentView,
        primary: true,
      },
      { href: '/classes', label: 'Turmas', icon: School, feature: Feature.ClassView },
    ],
  },
  {
    label: 'Acompanhamento',
    items: [
      { href: '/reports', label: 'Relatórios', icon: FileText, feature: Feature.ReportView },
      {
        href: '/report-templates',
        label: 'Modelos de relatório',
        icon: BookOpenCheck,
        feature: Feature.ReportTemplateView,
      },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { href: '/people', label: 'Pessoas', icon: Users, feature: Feature.PersonView },
      { href: '/guardians', label: 'Responsáveis', icon: IdCard, feature: Feature.GuardianView },
      { href: '/teachers', label: 'Professores', icon: UserCog, feature: Feature.TeacherView },
      { href: '/users', label: 'Contas de acesso', icon: KeyRound, feature: Feature.UserView },
    ],
  },
  {
    label: 'Vínculos',
    items: [
      {
        href: '/enrollments',
        label: 'Matrículas',
        icon: ClipboardList,
        feature: Feature.EnrollmentView,
      },
      {
        href: '/guardian-links',
        label: 'Responsável e aluno',
        icon: Link2,
        feature: Feature.GuardianLinkView,
      },
      {
        href: '/teacher-links',
        label: 'Professor e turma',
        icon: Link2,
        feature: Feature.TeacherLinkView,
      },
      {
        href: '/class-accesses',
        label: 'Acessos a turma',
        icon: ShieldCheck,
        feature: Feature.ClassAccessView,
      },
    ],
  },
  {
    label: 'Administração',
    items: [
      {
        href: '/school-years',
        label: 'Anos letivos',
        icon: CalendarRange,
        feature: Feature.SchoolYearView,
      },
      {
        href: '/roles',
        label: 'Perfis e permissões',
        icon: ShieldCheck,
        feature: Feature.RoleView,
      },
      {
        href: '/role-grants',
        label: 'Concessões de perfil',
        icon: UserPlus,
        feature: Feature.RoleGrantView,
      },
    ],
  },
];

export const ACCOUNT_ITEM: NavItem = { href: '/account', label: 'Minha conta', icon: UserCog };
