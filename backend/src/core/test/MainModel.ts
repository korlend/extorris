
class HelperClass {
  public static someHelp<T extends MainModel>(key: keyof T, instance: T): T[keyof T] {
    return instance[key];
  }
}

abstract class MainModel {
  someProperty: string = "";

  someMethod(key: keyof this) {
    // some code
    return HelperClass.someHelp(key, this);
  }
}

class FirstModel extends MainModel {
}

const firstModel = new FirstModel();
firstModel.someMethod("someProperty");
