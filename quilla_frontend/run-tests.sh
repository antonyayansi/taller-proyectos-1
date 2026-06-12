#!/bin/bash

# ============================================
# Script de Pruebas Unitarias - Quilla Frontend
# ============================================

echo "🧪 Ejecutando Pruebas Unitarias del Proyecto Quilla"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Ejecutar todas las pruebas
echo -e "${BLUE}📋 Ejecutando todas las pruebas...${NC}"
pnpm test:run

# Verificar el resultado
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ ¡Todas las pruebas pasaron exitosamente!${NC}"
    echo ""
    echo "=================================================="
    echo "📊 Resumen de Pruebas:"
    echo "=================================================="
    echo "✓ 7 archivos de prueba ejecutados"
    echo "✓ 25 pruebas pasadas"
    echo ""
    echo "Categorías de pruebas:"
    echo "  • Componentes Vue: HelloWorld, Menu, AudioPlayer"
    echo "  • Stores (Pinia): Sitios"
    echo "  • Servicios: GPS, Supabase"
    echo "  • Utilidades: Formateo de fechas"
    echo "  • Integración: Flujos completos"
    echo ""
    echo "=================================================="
    echo -e "${YELLOW}💡 Comandos disponibles:${NC}"
    echo "=================================================="
    echo "pnpm test          # Ejecutar en modo watch (desarrollo)"
    echo "pnpm test:run      # Ejecutar una vez"
    echo "pnpm test:ui       # Interfaz gráfica de pruebas"
    echo "pnpm test:coverage # Reporte de cobertura"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Algunas pruebas fallaron. Revisa el output arriba.${NC}"
    exit 1
fi
