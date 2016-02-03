function ProjectileSprite(config){
    BaseSprite.apply(this, arguments);
    config = config || {};
    config.material = ModelStore.get('projectile').material;

    Object.assign(this, config);

    this.scale.x = 10;
    this.scale.y = 10;
    this.scale.z = 10;
}

ProjectileSprite.extend(BaseSprite);
