export type Component<TProps = undefined> = TProps extends undefined
  ? () => ComponentInstance<undefined>
  : (props: TProps) => ComponentInstance<TProps>;

export interface ComponentInstance<TProps> {
  readonly uid: symbol;
  readonly props: TProps;

  render(props: TProps): Template;
}

export interface Template {
  readonly strings: readonly string[];
  readonly values: readonly TemplateValue[];
}

export type TemplateValue =
  | ComponentInstance<any>
  | bigint
  | boolean
  | number
  | string;

export function component<TProps>(
  render: (props: TProps) => Template
): Component<TProps> {
  const uid = Symbol();

  return ((props) => ({uid, props, render})) as Component<TProps>;
}
