# Baut den barocken Automaten (Kapitel II) in einer leeren Blender-Datei, headless.
# Teile getrennt (für die Explosion im Browser): sockel, gehaeuse, walze, kamm, zahnrad1-3, feder, kuppel, putto
import bpy, bmesh, math, os
from mathutils import Vector

SP = r'C:\Users\matta\AppData\Local\Temp\claude\C--web-agency-signedbymattia\8d50ce2f-a9d9-4448-85bd-3ac3f64f9645\scratchpad'
REPO = r'C:\web agency\signedbymattia'
bpy.ops.wm.read_factory_settings(use_empty=True)
szene = bpy.context.scene

def mat_marmor():
    m = bpy.data.materials.new('Marmor'); m.use_nodes = True
    nt = m.node_tree; b = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(REPO, 'marke', 'assets', '3d', 'marmor_kachel.jpg'))
    nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 0.4
    return m
def mat(name, rgb, metal=0.0, rough=0.4):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    return m
MAR = mat_marmor()
GOLD = mat('Gold', (0.98, 0.68, 0.26), 1.0, 0.18)
ROSA = mat('Rosa', (1.0, 0.48, 0.70), 0.0, 0.22)

def neu(name, m):
    o = bpy.context.active_object; o.name = name
    o.data.materials.clear(); o.data.materials.append(m)
    return o
def vereinen(objs, name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join(); o = bpy.context.active_object; o.name = name
    return o
def weich(o):
    for p in o.data.polygons: p.use_smooth = True
    return o
def fase(o, w=0.01, seg=3):
    b = o.modifiers.new('fase', 'BEVEL'); b.width = w; b.segments = seg; b.limit_method = 'ANGLE'
    return o
def anwenden(o):
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    for mo in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=mo.name)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    return o

teile = {}

# ---------- Sockel ----------
s = []
bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.64, depth=0.16, location=(0, 0, 0.14)); s.append(fase(neu('a', MAR)))
bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.55, depth=0.14, location=(0, 0, 0.29)); s.append(fase(neu('b', MAR)))
bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.61, depth=0.05, location=(0, 0, 0.385)); s.append(fase(neu('c', MAR)))
for i in range(4):
    a = math.pi / 8 + i * math.pi / 2
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.085, location=(math.cos(a) * 0.52, math.sin(a) * 0.52, 0.06)); s.append(weich(neu('f', MAR)))
for o in s: anwenden(o)
sock = vereinen(s, 'sockel')
bpy.ops.mesh.primitive_torus_add(major_radius=0.57, minor_radius=0.014, location=(0, 0, 0.36)); weich(neu('sockel_band', GOLD))
orn = [bpy.data.objects['sockel_band']]
for i in range(8):
    a = i * math.pi / 4 + math.pi / 8
    # Muschel-Fächer auf jeder Sockelseite
    for k in range(7):
        w = (k / 6) * math.pi
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.007, depth=0.075, location=(0, 0, 0))
        o = neu('rippe_m', GOLD)
        lx, lz = math.cos(w) * 0.035, math.sin(w) * 0.035 + 0.22
        o.location = (math.cos(a) * 0.57 + math.cos(a + math.pi / 2) * lx, math.sin(a) * 0.57 + math.sin(a + math.pi / 2) * lx, lz)
        o.rotation_euler = (0, w - math.pi / 2, a + math.pi / 2)
        o.rotation_mode = 'XYZ'
        anwenden(o); orn.append(o)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.014, location=(math.cos(a) * 0.575, math.sin(a) * 0.575, 0.215)); orn.append(anwenden(neu('perle', GOLD)))
    # Goldvolute an den Kanten
    bpy.ops.mesh.primitive_torus_add(major_radius=0.035, minor_radius=0.008, location=(math.cos(a - math.pi / 8) * 0.6, math.sin(a - math.pi / 8) * 0.6, 0.3), rotation=(math.pi / 2, 0, a - math.pi / 8 + math.pi / 2))
    orn.append(anwenden(weich(neu('volute', GOLD))))
teile['sockel'] = [sock, vereinen(orn, 'sockel_gold')]

# ---------- Gehäuse: 8 Säulen, Ringe unten und oben ----------
g = []
for i in range(8):
    a = i * math.pi / 4
    x, y = math.cos(a) * 0.48, math.sin(a) * 0.48
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.035, depth=0.78, location=(x, y, 0.83)); g.append(weich(neu('sa', MAR)))
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.05, depth=0.04, location=(x, y, 0.45)); g.append(neu('sb', MAR))
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.055, depth=0.05, location=(x, y, 1.2)); g.append(neu('sk', MAR))
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.56, depth=0.06, location=(0, 0, 1.25)); g.append(fase(neu('gebaelk', MAR)))
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.53, depth=0.04, location=(0, 0, 0.43)); g.append(fase(neu('boden', MAR)))
for o in g: anwenden(o)
geh = vereinen(g, 'gehaeuse')
gg = []
bpy.ops.mesh.primitive_torus_add(major_radius=0.565, minor_radius=0.012, location=(0, 0, 1.22)); gg.append(weich(neu('t1', GOLD)))
bpy.ops.mesh.primitive_torus_add(major_radius=0.565, minor_radius=0.012, location=(0, 0, 1.28)); gg.append(weich(neu('t2', GOLD)))
for i in range(8):
    a = i * math.pi / 4
    bpy.ops.mesh.primitive_torus_add(major_radius=0.045, minor_radius=0.008, location=(math.cos(a) * 0.48, math.sin(a) * 0.48, 1.175)); gg.append(weich(neu('kr', GOLD)))
for o in gg: anwenden(o)
teile['gehaeuse'] = [geh, vereinen(gg, 'gehaeuse_gold')]

# ---------- Walze (rosa) mit Goldstiften ----------
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.14, depth=0.56, location=(0, -0.05, 0.66), rotation=(0, math.pi / 2, 0)); walze = weich(neu('walze', ROSA)); anwenden(walze)
st = []
import random
random.seed(4)
for k in range(70):
    x = -0.25 + random.random() * 0.5; w = random.random() * 2 * math.pi
    p = Vector((x, -0.05 + math.cos(w) * 0.148, 0.66 + math.sin(w) * 0.148))
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.008, depth=0.03, location=p)
    o = neu('stift', GOLD); o.rotation_euler = (w - math.pi / 2, 0, 0); anwenden(o); st.append(o)
for sx in (-0.29, 0.29):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.16, depth=0.03, location=(sx, -0.05, 0.66), rotation=(0, math.pi / 2, 0)); st.append(weich(anwenden(neu('kappe', GOLD))))
teile['walze'] = [walze, vereinen(st, 'walze_gold')]

# ---------- Kamm (Gold) ----------
k = []
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.2, 0.6)); o = neu('kamm', GOLD); o.scale = (0.56, 0.08, 0.025); anwenden(o); k.append(fase(o, 0.004, 2))
for i in range(22):
    x = -0.26 + i * 0.0248
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0.13, 0.62)); o = neu('zahn', GOLD); o.scale = (0.014, 0.12 - (i % 5) * 0.006, 0.008); anwenden(o); k.append(o)
for o in k: anwenden(o)
teile['kamm'] = [vereinen(k, 'kamm')]

# ---------- Zahnräder ----------
def zahnrad(name, r, zaehne, dicke, ort, achse='y'):
    bm = bmesh.new()
    n = zaehne * 4
    pts = []
    for i in range(n):
        a = i / n * 2 * math.pi
        rr = r if (i % 4) in (1, 2) else r * 0.86
        pts.append(bm.verts.new((math.cos(a) * rr, math.sin(a) * rr, 0)))
    f = bm.faces.new(pts)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    bmesh.ops.translate(bm, vec=(0, 0, dicke), verts=[v for v in ext['geom'] if isinstance(v, bmesh.types.BMVert)])
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); szene.collection.objects.link(o)
    o.data.materials.append(GOLD)
    # Speichenlöcher: Ring + Nabe
    o.location = ort
    if achse == 'y': o.rotation_euler = (math.pi / 2, 0, 0)
    bpy.context.view_layer.objects.active = o
    fase(o, 0.003, 1)
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=r * 0.18, depth=dicke * 2.2, location=ort, rotation=(math.pi / 2, 0, 0) if achse == 'y' else (0, 0, 0))
    nabe = neu(name + '_nabe', ROSA)
    for oo in (o, nabe): anwenden(oo)
    return [o, nabe]
teile['zahnrad1'] = zahnrad('zahnrad1', 0.27, 28, 0.04, (0, -0.22, 0.95))
teile['zahnrad2'] = zahnrad('zahnrad2', 0.17, 18, 0.04, (0.33, -0.2, 0.8))
teile['zahnrad3'] = zahnrad('zahnrad3', 0.13, 14, 0.04, (-0.31, -0.2, 1.08))

# ---------- Feder (Spirale, liegend) ----------
kurve = bpy.data.curves.new('feder', 'CURVE'); kurve.dimensions = '3D'
sp = kurve.splines.new('POLY'); N = 220; sp.points.add(N - 1)
for i in range(N):
    t = i / N * 7 * 2 * math.pi; r = 0.02 + t * 0.0042
    sp.points[i].co = (math.cos(t) * r, math.sin(t) * r, 0, 1)
kurve.bevel_depth = 0.006; kurve.bevel_resolution = 2
fo = bpy.data.objects.new('feder', kurve); szene.collection.objects.link(fo); fo.location = (0, 0.2, 1.12)
fo.data.materials.append(GOLD)
bpy.ops.object.select_all(action='DESELECT'); fo.select_set(True); bpy.context.view_layer.objects.active = fo
bpy.ops.object.convert(target='MESH'); teile['feder'] = [bpy.context.active_object]

# ---------- Kuppel mit Goldrippen ----------
bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=0.16, location=(0, 0, 1.62))
ku = weich(neu('kuppel', MAR))
bm = bmesh.new(); bm.from_mesh(ku.data)
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < -0.001], context='VERTS'); bm.to_mesh(ku.data); bm.free()
ku.scale = (1, 1, 0.6); anwenden(ku)
rip = []
for i in range(8):
    bpy.ops.mesh.primitive_torus_add(major_radius=0.565, minor_radius=0.011, location=(0, 0, 1.28), rotation=(math.pi / 2, 0, i * math.pi / 8))
    o = neu('rippe', GOLD); o.scale = (1, 0.72, 1)
    anwenden(o)
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < 1.28 - 1.28], context='VERTS'); bm.to_mesh(o.data); bm.free()
    rip.append(weich(o))
# Rippen: nur obere Hälfte behalten (Weltkoordinaten)
for o in rip:
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if (o.matrix_world @ v.co).z < 1.285], context='VERTS'); bm.to_mesh(o.data); bm.free()
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.09, depth=0.06, location=(0, 0, 1.69)); rip.append(neu('krone', GOLD))
teile['kuppel'] = [ku, vereinen(rip, 'kuppel_gold')]

# ---------- Putto (aus CC-BY-Statue, nur Figur + Kugel) ----------
vorher = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=os.path.join(REPO, 'marke', 'assets', '3d', 'putto-statue-cc-by.glb'))
neu_objs = [o for o in bpy.data.objects if o not in vorher and o.type == 'MESH']
pu = neu_objs[0]
bpy.ops.object.select_all(action='DESELECT'); pu.select_set(True); bpy.context.view_layer.objects.active = pu
bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM'); bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
zs = [(pu.matrix_world @ v.co).z for v in pu.data.vertices]
zmin, zmax = min(zs), max(zs)
schnitt = zmin + (zmax - zmin) * 0.6
bm = bmesh.new(); bm.from_mesh(pu.data)
bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_center_median().z < schnitt], context='FACES'); bm.to_mesh(pu.data); bm.free()
zs = [v.co.z for v in pu.data.vertices]; zmin, zmax = min(zs), max(zs)
f = 0.42 / (zmax - zmin)
for v in pu.data.vertices: v.co = Vector((v.co.x * f, v.co.y * f, (v.co.z - zmin) * f + 1.71))
pu.name = 'putto'
for m in pu.data.materials:
    if m and m.use_nodes:
        b = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        if b:
            b.inputs['Roughness'].default_value = 0.45
            tint = m.node_tree.nodes.new('ShaderNodeMix'); tint.data_type = 'RGBA'; tint.blend_type = 'MULTIPLY'
            tint.inputs['Factor'].default_value = 1.0; tint.inputs[7].default_value = (1.0, 0.93, 0.9, 1)
            quelle = b.inputs['Base Color'].links[0].from_socket if b.inputs['Base Color'].links else None
            if quelle:
                m.node_tree.links.new(quelle, tint.inputs[6]); m.node_tree.links.new(tint.outputs[2], b.inputs['Base Color'])
for o in [o for o in bpy.data.objects if o not in vorher and o != pu]: bpy.data.objects.remove(o, do_unlink=True)
teile['putto'] = [pu]

# ---------- UV für Marmor, Teile benennen, speichern, exportieren ----------
for o in bpy.data.objects:
    if o.type == 'MESH' and o.data.materials and o.data.materials[0] == MAR:
        bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
        bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.cube_project(cube_size=0.8); bpy.ops.object.mode_set(mode='OBJECT')
# je Teil eine Gruppe (Empty) als Elternteil, damit three.js sie findet
for name, objs in teile.items():
    leer = bpy.data.objects.new(name, None); szene.collection.objects.link(leer)
    for o in objs: o.parent = leer
# Licht und Kamera für die Vorschau
bpy.ops.object.light_add(type='SUN', location=(-3, -4, 6)); bpy.context.active_object.data.energy = 5.5; bpy.context.active_object.rotation_euler = (0.7, -0.3, -0.6)
bpy.ops.object.camera_add(location=(2.6, -3.6, 1.9), rotation=(1.3, 0, 0.62)); szene.camera = bpy.context.active_object
w = bpy.data.worlds.new('w'); szene.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.85, 0.88, 0.95, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.55
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(REPO, 'marke', 'assets', '3d', 'automat-v1.blend'))
bpy.ops.object.select_all(action='DESELECT')
for name in teile:
    bpy.data.objects[name].select_set(True)
    for o in bpy.data.objects[name].children: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(REPO, 'marke', 'entwuerfe', 'hero', 'bilder', 'k2-automat.glb'), use_selection=True, export_format='GLB',
                          export_image_format='JPEG', export_jpeg_quality=85, export_draco_mesh_compression_enable=True, export_yup=True)
szene.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
szene.render.resolution_x = 900; szene.render.resolution_y = 900
szene.render.filepath = os.path.join(SP, 'automat-vorschau.png')
bpy.ops.render.render(write_still=True)
print('FERTIG', {k: len(v) for k, v in teile.items()})
