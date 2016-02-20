declare module "merge" {
  var merge : (
      object: any,
      ...otherArgs: any[]
  ) => any;

  export = merge;
}