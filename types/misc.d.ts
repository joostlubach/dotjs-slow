type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type Shared<
  InjectedProps,
  DecorationTargetProps extends Shared<InjectedProps, DecorationTargetProps>
> = {
  [P in Extract<keyof InjectedProps, keyof DecorationTargetProps>]?: DecorationTargetProps[P] extends InjectedProps[P] ? InjectedProps[P] : never;
}

type Constructor<T> = new (...args: any[]) => T

declare type Primitive = string | number | boolean

//------
// Used in HOC

interface HOC<InjectProps = {}> {
  <AllProps extends InjectProps>(Component: React.ComponentType<AllProps>):
    React.ComponentClass<Omit<AllProps, keyof InjectProps>>
}

interface ClassHOC<InjectProps = {}> {
  <AllProps extends InjectProps>(Component: React.ComponentClass<AllProps>):
    React.ComponentClass<Omit<AllProps, keyof InjectProps>>
}

//------
// Catch alls

interface AnyFunction {
  (...args: any[]): any
}
interface AnyObject {
  [key: string]: any
}