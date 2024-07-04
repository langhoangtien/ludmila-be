export interface MailData<T = never> {
  to: string;
  name?: string | null;
  data: T;
}
