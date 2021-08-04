export type Component<TProps = undefined> = TProps extends undefined
  ? (options?: ComponentOptions<TProps>) => ComponentInstance<TProps>
  : (options: ComponentOptions<TProps>) => ComponentInstance<TProps>;

export type ComponentOptions<TProps> = TProps extends undefined
  ? {readonly key?: string; readonly props?: TProps}
  : {readonly key?: string; readonly props: TProps};

export interface ComponentInstance<TProps> {
  readonly type: symbol;
  readonly key?: string;
  readonly props: TProps;

  render(props: TProps): Template;
}

export interface Template {
  readonly strings: readonly [string, ...string[]];
  readonly values: readonly TemplateValue[];
}

export type TemplateValue =
  | ComponentInstance<any>
  | readonly [string, ...ComponentInstance<any>[]]
  | bigint
  | boolean
  | number
  | string;

export function component<TProps>(
  render: (props: TProps) => Template
): Component<TProps> {
  const type = Symbol();

  return ((options?: ComponentOptions<TProps>) => ({
    type,
    key: options?.key,
    props: options?.props,
    render,
  })) as Component<TProps>;
}
