#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simulador de Impacto de Meteoritos - Vista 2D con Pygame
Muestra una vista desde la superficie de la Tierra del impacto de un meteorito
"""

import pygame
import math
import random
import json
import sys
import os
from datetime import datetime

# Configuración de colores
COLORS = {
    'BLACK': (0, 0, 0),
    'WHITE': (255, 255, 255),
    'RED': (255, 0, 0),
    'ORANGE': (255, 165, 0),
    'YELLOW': (255, 255, 0),
    'GREEN': (0, 255, 0),
    'BLUE': (0, 0, 255),
    'PURPLE': (128, 0, 128),
    'GRAY': (128, 128, 128),
    'DARK_GRAY': (64, 64, 64),
    'LIGHT_GRAY': (192, 192, 192),
    'BROWN': (139, 69, 19),
    'SKY_BLUE': (135, 206, 235),
    'FIRE_RED': (255, 69, 0),
    'DUST_BROWN': (160, 82, 45)
}

class MeteorImpact2D:
    def __init__(self, width=1200, height=800):
        """Inicializar la simulación 2D del impacto"""
        pygame.init()
        
        self.width = width
        self.height = height
        self.screen = pygame.display.set_mode((width, height))
        pygame.display.set_caption("Simulador de Impacto de Meteoritos - Vista 2D")
        
        self.clock = pygame.time.Clock()
        self.running = True
        
        # Estado de la simulación
        self.simulation_data = None
        self.impact_point = (width // 2, height // 2)
        self.time_elapsed = 0
        self.animation_speed = 1.0
        
        # Efectos visuales
        self.explosion_particles = []
        self.fire_particles = []
        self.dust_particles = []
        self.shock_waves = []
        self.buildings = []
        
        # Configuración de la simulación
        self.show_data_panel = True
        self.show_effects = True
        self.pause_simulation = False
        
        # Fuentes
        self.font_large = pygame.font.Font(None, 36)
        self.font_medium = pygame.font.Font(None, 24)
        self.font_small = pygame.font.Font(None, 18)
        
        # Crear entorno inicial
        self.create_environment()
        
    def create_environment(self):
        """Crear el entorno inicial (cielo, horizonte, edificios)"""
        # Crear edificios aleatorios
        self.buildings = []
        for i in range(20):
            x = random.randint(0, self.width)
            height = random.randint(50, 200)
            width = random.randint(30, 80)
            color = random.choice([COLORS['GRAY'], COLORS['DARK_GRAY'], COLORS['BROWN']])
            
            self.buildings.append({
                'rect': pygame.Rect(x, self.height - height, width, height),
                'color': color,
                'destroyed': False
            })
    
    def load_simulation_data(self, data):
        """Cargar datos de simulación desde JavaScript"""
        self.simulation_data = data
        self.impact_point = (self.width // 2, self.height // 2)
        
        # Calcular efectos basados en los datos
        self.calculate_effects()
    
    def calculate_effects(self):
        """Calcular efectos del impacto basados en los datos"""
        if not self.simulation_data:
            return
        
        effects = self.simulation_data.get('effects', {})
        
        # Calcular radios de efectos
        self.total_destruction_radius = effects.get('totalDestructionZone', 0) * 10  # Escalar para visualización
        self.severe_destruction_radius = effects.get('severeDestructionZone', 0) * 10
        self.moderate_destruction_radius = effects.get('moderateDestructionZone', 0) * 10
        
        # Calcular efectos secundarios
        self.earthquake_magnitude = effects.get('earthquake', {}).get('magnitude', 0)
        self.tsunami_height = effects.get('tsunami', {}).get('height', 0)
        self.fire_radius = effects.get('fire', {}).get('radius', 0) * 10
        self.dust_radius = effects.get('dust', {}).get('radius', 0) * 10
        
        # Calcular víctimas
        self.casualties = effects.get('casualties', {})
        
        # Calcular energía
        self.energy_megatons = effects.get('energyMegatons', 0)
        
    def create_explosion(self):
        """Crear efectos de explosión"""
        # Crear partículas de explosión
        for _ in range(100):
            angle = random.uniform(0, 2 * math.pi)
            speed = random.uniform(50, 200)
            lifetime = random.uniform(1, 3)
            
            self.explosion_particles.append({
                'x': self.impact_point[0],
                'y': self.impact_point[1],
                'vx': math.cos(angle) * speed,
                'vy': math.sin(angle) * speed,
                'lifetime': lifetime,
                'max_lifetime': lifetime,
                'color': random.choice([COLORS['RED'], COLORS['ORANGE'], COLORS['YELLOW']]),
                'size': random.randint(2, 8)
            })
        
        # Crear ondas de choque
        for i in range(5):
            self.shock_waves.append({
                'x': self.impact_point[0],
                'y': self.impact_point[1],
                'radius': 0,
                'max_radius': self.total_destruction_radius * (i + 1),
                'speed': 100 + i * 50,
                'lifetime': 3 - i * 0.5,
                'max_lifetime': 3 - i * 0.5,
                'color': COLORS['YELLOW']
            })
    
    def create_fire_effects(self):
        """Crear efectos de incendios"""
        for _ in range(50):
            # Distribuir incendios alrededor del impacto
            angle = random.uniform(0, 2 * math.pi)
            distance = random.uniform(0, self.fire_radius)
            
            x = self.impact_point[0] + math.cos(angle) * distance
            y = self.impact_point[1] + math.sin(angle) * distance
            
            if 0 <= x <= self.width and 0 <= y <= self.height:
                self.fire_particles.append({
                    'x': x,
                    'y': y,
                    'vx': random.uniform(-20, 20),
                    'vy': random.uniform(-30, -10),
                    'lifetime': random.uniform(2, 5),
                    'max_lifetime': random.uniform(2, 5),
                    'color': random.choice([COLORS['FIRE_RED'], COLORS['ORANGE'], COLORS['YELLOW']]),
                    'size': random.randint(1, 4)
                })
    
    def create_dust_effects(self):
        """Crear efectos de nube de polvo"""
        for _ in range(200):
            # Crear nube de polvo que se expande
            angle = random.uniform(0, 2 * math.pi)
            distance = random.uniform(0, self.dust_radius)
            
            x = self.impact_point[0] + math.cos(angle) * distance
            y = self.impact_point[1] + math.sin(angle) * distance
            
            if 0 <= x <= self.width and 0 <= y <= self.height:
                self.dust_particles.append({
                    'x': x,
                    'y': y,
                    'vx': random.uniform(-10, 10),
                    'vy': random.uniform(-5, 5),
                    'lifetime': random.uniform(5, 10),
                    'max_lifetime': random.uniform(5, 10),
                    'color': COLORS['DUST_BROWN'],
                    'size': random.randint(1, 3),
                    'alpha': random.uniform(0.3, 0.8)
                })
    
    def update_particles(self, dt):
        """Actualizar todas las partículas"""
        # Actualizar partículas de explosión
        self.explosion_particles = [p for p in self.explosion_particles if p['lifetime'] > 0]
        for particle in self.explosion_particles:
            particle['x'] += particle['vx'] * dt
            particle['y'] += particle['vy'] * dt
            particle['lifetime'] -= dt
            particle['vy'] += 50 * dt  # Gravedad
        
        # Actualizar partículas de fuego
        self.fire_particles = [p for p in self.fire_particles if p['lifetime'] > 0]
        for particle in self.fire_particles:
            particle['x'] += particle['vx'] * dt
            particle['y'] += particle['vy'] * dt
            particle['lifetime'] -= dt
            particle['vy'] += 20 * dt  # Gravedad más suave
        
        # Actualizar partículas de polvo
        self.dust_particles = [p for p in self.dust_particles if p['lifetime'] > 0]
        for particle in self.dust_particles:
            particle['x'] += particle['vx'] * dt
            particle['y'] += particle['vy'] * dt
            particle['lifetime'] -= dt
        
        # Actualizar ondas de choque
        self.shock_waves = [w for w in self.shock_waves if w['lifetime'] > 0]
        for wave in self.shock_waves:
            wave['radius'] += wave['speed'] * dt
            wave['lifetime'] -= dt
    
    def destroy_buildings(self):
        """Destruir edificios en la zona de impacto"""
        for building in self.buildings:
            if not building['destroyed']:
                # Calcular distancia al impacto
                building_center = (
                    building['rect'].x + building['rect'].width // 2,
                    building['rect'].y + building['rect'].height // 2
                )
                
                distance = math.sqrt(
                    (building_center[0] - self.impact_point[0])**2 +
                    (building_center[1] - self.impact_point[1])**2
                )
                
                # Destruir edificios en zona de destrucción total
                if distance <= self.total_destruction_radius:
                    building['destroyed'] = True
                    building['color'] = COLORS['RED']
    
    def draw_background(self):
        """Dibujar el fondo (cielo y horizonte)"""
        # Gradiente del cielo
        for y in range(self.height // 2):
            color_factor = y / (self.height // 2)
            color = (
                int(135 + color_factor * 120),  # R
                int(206 + color_factor * 49),   # G
                int(235 + color_factor * 20)    # B
            )
            pygame.draw.line(self.screen, color, (0, y), (self.width, y))
        
        # Horizonte
        pygame.draw.line(self.screen, COLORS['BROWN'], 
                        (0, self.height // 2), (self.width, self.height // 2), 3)
    
    def draw_buildings(self):
        """Dibujar edificios"""
        for building in self.buildings:
            if not building['destroyed']:
                pygame.draw.rect(self.screen, building['color'], building['rect'])
                pygame.draw.rect(self.screen, COLORS['BLACK'], building['rect'], 2)
            else:
                # Dibujar edificio destruido
                pygame.draw.rect(self.screen, COLORS['DARK_GRAY'], building['rect'])
                # Agregar efectos de destrucción
                for i in range(5):
                    x = building['rect'].x + random.randint(0, building['rect'].width)
                    y = building['rect'].y + random.randint(0, building['rect'].height)
                    pygame.draw.circle(self.screen, COLORS['RED'], (x, y), 2)
    
    def draw_impact_zones(self):
        """Dibujar zonas de impacto"""
        if not self.simulation_data:
            return
        
        # Zona de destrucción moderada
        pygame.draw.circle(self.screen, COLORS['YELLOW'], 
                          self.impact_point, int(self.moderate_destruction_radius), 2)
        
        # Zona de destrucción severa
        pygame.draw.circle(self.screen, COLORS['ORANGE'], 
                          self.impact_point, int(self.severe_destruction_radius), 2)
        
        # Zona de destrucción total
        pygame.draw.circle(self.screen, COLORS['RED'], 
                          self.impact_point, int(self.total_destruction_radius), 2)
    
    def draw_particles(self):
        """Dibujar todas las partículas"""
        # Dibujar partículas de explosión
        for particle in self.explosion_particles:
            alpha = particle['lifetime'] / particle['max_lifetime']
            size = int(particle['size'] * alpha)
            if size > 0:
                pygame.draw.circle(self.screen, particle['color'], 
                                (int(particle['x']), int(particle['y'])), size)
        
        # Dibujar partículas de fuego
        for particle in self.fire_particles:
            alpha = particle['lifetime'] / particle['max_lifetime']
            size = int(particle['size'] * alpha)
            if size > 0:
                pygame.draw.circle(self.screen, particle['color'], 
                                (int(particle['x']), int(particle['y'])), size)
        
        # Dibujar partículas de polvo
        for particle in self.dust_particles:
            alpha = particle['lifetime'] / particle['max_lifetime'] * particle['alpha']
            size = int(particle['size'] * alpha)
            if size > 0:
                # Crear superficie con transparencia
                dust_surface = pygame.Surface((size * 2, size * 2), pygame.SRCALPHA)
                pygame.draw.circle(dust_surface, (*particle['color'], int(alpha * 255)), 
                                (size, size), size)
                self.screen.blit(dust_surface, 
                               (int(particle['x'] - size), int(particle['y'] - size)))
    
    def draw_shock_waves(self):
        """Dibujar ondas de choque"""
        for wave in self.shock_waves:
            alpha = wave['lifetime'] / wave['max_lifetime']
            if alpha > 0:
                # Crear superficie con transparencia
                wave_surface = pygame.Surface((int(wave['radius'] * 2), int(wave['radius'] * 2)), 
                                    pygame.SRCALPHA)
                pygame.draw.circle(wave_surface, (*wave['color'], int(alpha * 100)), 
                                (int(wave['radius']), int(wave['radius'])), 
                                int(wave['radius']), 3)
                self.screen.blit(wave_surface, 
                               (int(wave['x'] - wave['radius']), int(wave['y'] - wave['radius'])))
    
    def draw_data_panel(self):
        """Dibujar panel de datos"""
        if not self.show_data_panel or not self.simulation_data:
            return
        
        # Fondo del panel
        panel_rect = pygame.Rect(10, 10, 300, 400)
        pygame.draw.rect(self.screen, COLORS['BLACK'], panel_rect)
        pygame.draw.rect(self.screen, COLORS['WHITE'], panel_rect, 2)
        
        # Título
        title_text = self.font_large.render("Datos del Impacto", True, COLORS['WHITE'])
        self.screen.blit(title_text, (20, 20))
        
        # Datos
        y_offset = 60
        data_items = [
            ("Energía Liberada:", f"{self.energy_megatons:.1f} MT"),
            ("Víctimas Estimadas:", f"{self.casualties.get('fatalities', 0):,}"),
            ("Heridos:", f"{self.casualties.get('injuries', 0):,}"),
            ("Magnitud Terremoto:", f"{self.earthquake_magnitude:.1f}"),
            ("Altura Tsunami:", f"{self.tsunami_height:.1f}m"),
            ("Radio Incendios:", f"{self.fire_radius/10:.1f} km"),
            ("Radio Polvo:", f"{self.dust_radius/10:.1f} km"),
            ("Tiempo:", f"{self.time_elapsed:.1f}s")
        ]
        
        for label, value in data_items:
            label_text = self.font_medium.render(label, True, COLORS['WHITE'])
            value_text = self.font_medium.render(value, True, COLORS['YELLOW'])
            
            self.screen.blit(label_text, (20, y_offset))
            self.screen.blit(value_text, (200, y_offset))
            y_offset += 25
    
    def draw_controls(self):
        """Dibujar controles"""
        controls_text = [
            "Controles:",
            "ESPACIO - Pausar/Reanudar",
            "D - Mostrar/Ocultar Datos",
            "E - Mostrar/Ocultar Efectos",
            "R - Reiniciar Simulación",
            "ESC - Salir"
        ]
        
        y_offset = self.height - 150
        for text in controls_text:
            color = COLORS['YELLOW'] if text.startswith("Controles:") else COLORS['WHITE']
            rendered_text = self.font_small.render(text, True, color)
            self.screen.blit(rendered_text, (self.width - 200, y_offset))
            y_offset += 20
    
    def handle_events(self):
        """Manejar eventos de entrada"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.running = False
                elif event.key == pygame.K_SPACE:
                    self.pause_simulation = not self.pause_simulation
                elif event.key == pygame.K_d:
                    self.show_data_panel = not self.show_data_panel
                elif event.key == pygame.K_e:
                    self.show_effects = not self.show_effects
                elif event.key == pygame.K_r:
                    self.reset_simulation()
    
    def reset_simulation(self):
        """Reiniciar la simulación"""
        self.time_elapsed = 0
        self.explosion_particles = []
        self.fire_particles = []
        self.dust_particles = []
        self.shock_waves = []
        
        # Recrear edificios
        self.create_environment()
        
        # Reiniciar efectos si hay datos
        if self.simulation_data:
            self.create_explosion()
            self.create_fire_effects()
            self.create_dust_effects()
    
    def run_simulation(self, simulation_data=None):
        """Ejecutar la simulación principal"""
        if simulation_data:
            self.load_simulation_data(simulation_data)
            self.create_explosion()
            self.create_fire_effects()
            self.create_dust_effects()
        
        while self.running:
            dt = self.clock.tick(60) / 1000.0  # Delta time en segundos
            
            if not self.pause_simulation:
                self.time_elapsed += dt * self.animation_speed
                
                # Actualizar efectos
                self.update_particles(dt)
                
                # Destruir edificios progresivamente
                if self.time_elapsed > 0.5:  # Después de 0.5 segundos
                    self.destroy_buildings()
            
            # Manejar eventos
            self.handle_events()
            
            # Dibujar
            self.draw_background()
            self.draw_buildings()
            
            if self.show_effects:
                self.draw_impact_zones()
                self.draw_particles()
                self.draw_shock_waves()
            
            self.draw_data_panel()
            self.draw_controls()
            
            # Actualizar pantalla
            pygame.display.flip()
        
        pygame.quit()

def main():
    """Función principal"""
    # Crear instancia del simulador
    simulator = MeteorImpact2D()
    
    # Datos de ejemplo para la simulación
    example_data = {
        "effects": {
            "energyMegatons": 15.5,
            "totalDestructionZone": 5.2,
            "severeDestructionZone": 12.8,
            "moderateDestructionZone": 25.6,
            "casualties": {
                "fatalities": 125000,
                "injuries": 375000
            },
            "earthquake": {
                "magnitude": 7.8
            },
            "tsunami": {
                "height": 45.2
            },
            "fire": {
                "radius": 8.5
            },
            "dust": {
                "radius": 18.3
            }
        }
    }
    
    # Ejecutar simulación
    simulator.run_simulation(example_data)

if __name__ == "__main__":
    main()
